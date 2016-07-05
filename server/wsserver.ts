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

app["ws"]("/", async (ws: WebSocket, req: express.Request) => {
  let user: User = req.user
  if (!user) {
    // anonymous
    let random_username = Math.random().toString(36).substring(7)
    user = await User.create({
      name: random_username,
    })
  }
  const userData = {name: user.name}

  // create connection
  const connection = await Connection.create({userId: user["id"], available: true})

  // join event
  broadcast(await new JoinEvent(userData).response())

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

  ws.on('message', async (undecoded_json: string) => {
    try {
      let json = JSON.parse(undecoded_json)
      let {ev, value} = json
      let messageEvent: BaseReceiveEvent

      if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
        messageEvent = new CreateMessageEvent(userData, value)
      } else if (ev === ReceiveEventType[ReceiveEventType.DELETE_MESSAGE]) {
        messageEvent = new DeleteMessageEvent(userData, value)
      }
      if (ev === ReceiveEventType[ReceiveEventType.PONG]) {
        if (++value == ping_count) {
          ping_available = true
        }
      }
      broadcast(await messageEvent.response())
    } catch(e) {
      // failed
    }
  })

  let onClose = async () => {
    let event = new LeftEvent(userData)
    try {
      broadcast(await event.response())
      // destroy connection
      await connection.destroy()
    } catch(e) {
      // failed
    }
  }
  ws.on('close', onClose)
})
