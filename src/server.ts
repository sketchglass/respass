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

export let bootup = () => {
  let wss = new Server({port: 8080})

  let broadcast = (message): void => {
    wss.clients.forEach((client) => {
      client.send(message)
    })
  }


  wss.on('connection', (ws) => {
    ws.send("starting connection")
    // send latest 10 messages
    findLatestMessage(10).then((messages) => {
      messages.forEach((obj) => {
        ws.send(obj["text"])
      })
    })

    ws.on('message', (message) => {
      Message.create({text: message})
      broadcast(message)
    })
  })
}
