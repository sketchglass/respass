import { Server } from "ws"
import { Message, User } from "./models"

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
interface IMessage {
  text: string,
  user: {
    name: string
  }
}
interface IUser {
  name: string
}
class BaseReceiveEvent {

  constructor(protected user: IUser, protected ev: ReceiveEventType, protected value?: string) {
    
  }
  response(): string {
    return ""
  }
}
class CreateMessageEvent extends BaseReceiveEvent{
  response() {
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

    return newMessage(SendEventType.NEW_MESSAGE, {
      text: this.value,
      user: {
        name: this.user.name
      }
    })
  }
}
class DeleteMessageEvent extends BaseReceiveEvent{
  response() {
    Message.destroy({where: {id: this.value}})
    return newMessage(SendEventType.DELETE_MESSAGE, this.value) 
  }
}
class JoinEvent extends BaseReceiveEvent {
  response() {
    return newMessage(SendEventType.USER_JOIN, "User " + this.user.name + " is joined.")
  }
}
class LeftEvent extends BaseReceiveEvent {
  response() {
    return newMessage(SendEventType.USER_LEAVE, "User " + this.user.name + " is left.")
  }
}
let newMessage = (ev: SendEventType, value: any) => {
  return JSON.stringify({
    ev: SendEventType[ev],
    value: value,
  })
}
let wss = new Server({port: 8080})

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
  let response = new JoinEvent(user, ReceiveEventType.JOIN).response()
  broadcast(response)

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
      broadcast(messageEvent.response())
    } catch(e) {
      // failed
    }
  })
  ws.on('close', () => {
    let response = new LeftEvent(user, ReceiveEventType.LEFT).response()
    try {
      broadcast(response)
    } catch(e) {
      // failed
    }
  })
})
