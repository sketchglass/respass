import { Server } from "ws"
import { Message, User } from "./models"
import { IMessage, IUser } from "../common/data";
import { server } from "./server";

let findLatestMessage = (num: number) => {
  return Message.findAll({
    limit: num,
    order: "id DESC",
    raw: true
  }).then((messages) => {
    return messages.reverse()
  })
}

enum ReceiveEventType {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  JOIN,
  PONG,
  LEFT,
}
enum SendEventType {
  NEW_MESSAGE,
  DELETE_MESSAGE,
  USER_JOIN,
  USER_LEAVE,
  PING,
}

let connection_number = 0

abstract class BaseReceiveEvent {
  constructor(protected user: IUser, protected ev: ReceiveEventType, protected value?: string) {
  }
  abstract response(target: Function): string
}
class CreateMessageEvent extends BaseReceiveEvent{
  response(target: Function) {
    User.findOne({
      where: {
        name: this.user.name
      },
      raw: true
    }).then((user) => {
      Message.create({
        text: this.value,
        // omg wtf...
        userId: (<any>user)["id"]
      })
    })

    return target(newMessage(SendEventType.NEW_MESSAGE, {
      text: this.value,
      user: {
        name: this.user.name
      }
    }))
  }
}
class DeleteMessageEvent extends BaseReceiveEvent{
  response(target: Function) {
    Message.destroy({where: {id: this.value}})
    return target(newMessage(SendEventType.DELETE_MESSAGE, this.value) )
  }
}
class JoinEvent extends BaseReceiveEvent {
  response(target: Function) {
    connection_number += 1
    return target(newMessage(SendEventType.USER_JOIN, {
      "connections": connection_number
    }))
  }
}
class LeftEvent extends BaseReceiveEvent {
  response(target: Function) {
    connection_number -= 1
    return target(newMessage(SendEventType.USER_LEAVE, {
      "connections": connection_number
    }))
  }
}
let newMessage = (ev: SendEventType, value: any) => {
  return JSON.stringify({
    ev: SendEventType[ev],
    value: value,
  })
}
let wss = new Server({server})

let broadcast = (message: string): void => {
  wss.clients.forEach((client) => {
    client.send(message)
  })
}

wss.on('connection', (ws) => {

  // create random user name
  let random_username = Math.random().toString(36).substring(7)

  let user: IUser = {
    name: random_username
  }
  User.create(user)

  // join event
  new JoinEvent(user, ReceiveEventType.JOIN).response(broadcast)

  ws.on('message', (undecoded_json: string) => {
    try {
      let json = JSON.parse(undecoded_json)
      let {ev, value} = json
      let messageEvent: BaseReceiveEvent

      if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
        messageEvent = new CreateMessageEvent(user, ev, value)
      } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
        messageEvent = new DeleteMessageEvent(user, ev, value)
      }
      messageEvent.response(broadcast)
    } catch(e) {
      // failed
    }
  })
  ws.on('close', () => {
    let event = new LeftEvent(user, ReceiveEventType.LEFT)
    try {
      event.response(broadcast)
    } catch(e) {
      // failed
    }
  })
})
