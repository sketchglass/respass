import { Server } from "ws"
import { Message, User } from "./models"
import { IMessage, IUser } from "../common/data";
import { server } from "./server";
import { ReceiveEventType, SendEventType } from "../common/eventType" 

let connection_number = 0

abstract class BaseReceiveEvent {
  constructor(protected user: IUser, protected ev?: ReceiveEventType, protected value?: string) {
  }
  abstract response(target: Function): void
}
class CreateMessageEvent extends BaseReceiveEvent{
  response(target: Function) {
    if (this.value === "")
      return
        
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

    target(newMessage(SendEventType.NEW_MESSAGE, {
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
    try {
      client.send(message)
    } catch(e) {
      console.error(e)
    }
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

  // ping/pong event
  let ping_count: number = 0
  let ping_available: boolean = false
  
  setInterval(() => {
    try {
      if (ws.readyState == ws.OPEN) {
        ws.send(newMessage(SendEventType.PING, ping_count++))
        setTimeout(() => {
          if(ping_available === false) {
            ws.close()
          }
        } ,10000)
      }
    } catch (e) {
      console.log(e)
    }
  },2000)



  ws.on('message', (undecoded_json: string) => {
    try {
      let json = JSON.parse(undecoded_json)
      let {ev, value} = json
      let messageEvent: BaseReceiveEvent
      ping_available = false

      if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
        messageEvent = new CreateMessageEvent(user, ev, value)
        ping_available = true
      } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
        messageEvent = new DeleteMessageEvent(user, ev, value)
        ping_available = true
      } 
      if (ev === ReceiveEventType[ReceiveEventType.PONG]) {
        if (++value == ping_count) {
          ping_available = true
        }
      }
      messageEvent.response(broadcast)
    } catch(e) {
      // failed
    }
  })

  let onClose = () => {
    let event = new LeftEvent(user, ReceiveEventType.LEFT)
    try {
      event.response(broadcast)
    } catch(e) {
      // failed
    }
  }
  ws.on('close', onClose) 
})
