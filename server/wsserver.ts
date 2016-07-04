import * as WebSocket from "ws"
import * as express from "express";
import { Message, User, Connection } from "./models"
import { IMessage, IUser } from "../common/data";
import { app } from "./app";
import { ReceiveEventType, SendEventType } from "../common/eventType"
import { newMessage, BaseReceiveEvent, JoinEvent, CreateMessageEvent, DeleteMessageEvent, LeftEvent } from "./events"

const expressWs = require('express-ws')(app);
const wss: WebSocket.Server = expressWs.getWss();

let broadcast = (message: string): void => {
  wss.clients.forEach((client) => {
    try {
      client.send(message)
    } catch(e) {
      // nothing to do
    }
  })
}

app["ws"]("/", (ws: WebSocket, req: express.Request) => {
  let user: IUser
  if (req.user) {
    user = {
      name: req.user.name,
    };
  } else {
    // anonymous
    let random_username = Math.random().toString(36).substring(7)
    user = {
      name: random_username,
    }
    User.create(user)
  }

  let connection = {
    available: true
  }

  let connection_id: number

  let create_connection = () => {
    User.findOne({where: {name: user.name}}).then((user: any) => {
      Connection.create({userId: user["id"], available: true}).then((connection: any) => {
        connection_id = connection["id"]
      })
    })
  }
  let destroy_connection = () => {
    Connection.destroy({
      where: {
        id: connection_id
      }
    })
  }
  create_connection()


  // join event
  new JoinEvent(user).response(broadcast)

  // ping/pong event
  let ping_count: number = 0
  let ping_available: boolean = false

  let interval = setInterval(() => {
    try {
      if (ws.readyState == ws.OPEN) {
        ws.send(newMessage(SendEventType.PING, ping_count++))
      }
    } catch (e) {
      console.log(e)
    }
    ping_available = false
    setTimeout(() => {
      if(ping_available === false) {
        console.error("ping is not available")
        ws.close()
        clearInterval(interval)
        return
      }
    } ,4000)
  },4000)



  ws.on('message', (undecoded_json: string) => {
    try {
      let json = JSON.parse(undecoded_json)
      let {ev, value} = json
      let messageEvent: BaseReceiveEvent

      if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
        messageEvent = new CreateMessageEvent(user, value)
      } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
        messageEvent = new DeleteMessageEvent(user, value)
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
      // destroy connection
      destroy_connection()
    } catch(e) {
      // failed
    }
  }
  ws.on('close', onClose)
})
