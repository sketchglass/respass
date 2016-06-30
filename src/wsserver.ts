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
interface Message {
  text: string,
  user: {
    name: string
  }
}

class BaseReceiveEvent {
  constructor(protected ev: ReceiveEventType, protected value: any) {
  }
  response(): string {
    return ""
  }
}
class CreateMessageEvent extends BaseReceiveEvent{
  response() {
    Message.create({text: this.value.text})
    return newMessage(SendEventType.NEW_MESSAGE, this.value)
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
    return newMessage(SendEventType.USER_JOIN, this.value as Message)
  }
}
class LeftEvent extends BaseReceiveEvent {
  response() {
    return newMessage(SendEventType.USER_LEAVE, this.value)
  }
}
let newMessage = (ev: SendEventType, value: any) => {
  return JSON.stringify({
    ev: SendEventType[ev],
    value: value,
  })
}
export let bootup = () => {
  let wss = new Server({port: 8080})

  let broadcast = (message: string): void => {
    wss.clients.forEach((client) => {
      client.send(message)
    })
  }
  
  wss.on('connection', (ws) => {
    // create random user name
    let random_username = Math.random().toString(36).substring(7) 

    let current_user = {name: random_username}
    User.create(current_user)

    // join event
    let response = new JoinEvent(ReceiveEventType.JOIN, "user " + current_user.name + " joined").response()
    broadcast(response)

    // ping/event
    // setInterval(() => {
      // try {
        // ws.send(newMessage(SendEventType.PING, ""))
      // } catch (e) {
        // clearInterval(this)
      // }
    // }, 2000)

    ws.on('message', (undecoded_json: string) => {
      try {
        let json = JSON.parse(undecoded_json)
        let {ev, value} = json
        let messageEvent: BaseReceiveEvent

        if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
          messageEvent = new CreateMessageEvent(ev, {
            text: value,
            user: {
              name: current_user.name
            }
          })
        } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
          messageEvent = new DeleteMessageEvent(ev, value)
        }
        broadcast(messageEvent.response())
      } catch(e) {
        // failed
      }
    })
    ws.on('close', () => {
      let response = new LeftEvent(ReceiveEventType.LEFT, "user left").response()
      try {
        broadcast(response)
      } catch(e) {
        // failed
      }
    })
  })
}
