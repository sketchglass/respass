import { Server } from "ws"
import { Message } from "./models"
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
  PONG,
}
enum SendEventType {
  NEW_MESSAGE,
  PING,
}

class BaseReceiveEvent {
  constructor(protected ev: ReceiveEventType, protected value: string) {
  }
  response() {
  }
}
class CreateMessageEvent extends BaseReceiveEvent{
  response() {
    Message.create({text: this.value})
    return newMessage(SendEventType.NEW_MESSAGE, this.value) 
  }
}
let newMessage = (ev: SendEventType, value: string) => {
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
    // send latest 10 messages
    findLatestMessage(10).then((messages) => {
      messages.forEach((obj) => {
        ws.send(newMessage(SendEventType.NEW_MESSAGE, (<any>obj)["text"]))
      })
    })

    // wip
    // setInterval(() => {
      // ws.send(newMessage(SendEventType.PING, ""))
    // }, 2000)
    /*
     * expected json shceme:
     * {
     *   "ev": "CREATE_MESSAGE",
     *   "value": value,
     * }
     *
     * result json scheme:
     * {
     *   "ev":"NEW_MESSAGE",
     *   "value":""
     * }
     */
    ws.on('message', (undecoded_json: string) => {
      try {
        let json = JSON.parse(undecoded_json)
        // switching
        let {ev, value} = json
        if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
          let response = new CreateMessageEvent(ev, value).response()
          broadcast(response)
        }
      } catch(e) {
        // failed
      }
    })
  })
}
