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
}
enum SendEventType {
  NEW_MESSAGE,
}

let newMessage = (message: string) => {
  return JSON.stringify({
    ev: SendEventType[SendEventType.NEW_MESSAGE],
    value: message,
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
        ws.send(newMessage((<any>obj)["text"]))
      })
    })

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
          Message.create({text: value})
          broadcast(newMessage(value))
        }
      } catch(e) {
        // failed
      }
    })
  })
}
