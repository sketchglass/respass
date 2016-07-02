import { Server } from "ws"
import { Message, User } from "./models"
import { IMessage, IUser } from "../common/data";
import { server } from "./server";
import { ReceiveEventType, SendEventType } from "../common/eventType" 
import { newMessage, BaseReceiveEvent, JoinEvent, CreateMessageEvent, DeleteMessageEvent, LeftEvent } from "./events"

let wss = new Server({server})

let broadcast = (message: string): void => {
  wss.clients.forEach((client) => {
    try {
      client.send(message)
    } catch(e) {
      // nothing to do
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
  new JoinEvent(user).response(broadcast)

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
        messageEvent = new CreateMessageEvent(user, value)
        ping_available = true
      } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
        messageEvent = new DeleteMessageEvent(user, value)
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
    let event = new LeftEvent(user)
    try {
      event.response(broadcast)
    } catch(e) {
      // failed
    }
  }
  ws.on('close', onClose) 
})
