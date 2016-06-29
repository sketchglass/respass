import { Server } from "ws"
import Sequelize = require("sequelize")

// define models
let sequelize = new Sequelize('sample','','',{dialect:'sqlite',storage:'./sample.db'})
let Message = sequelize.define('message', {
  text: Sequelize.STRING,
});
Message.sync({
  // !! breaks current db (do not use in production)
  // force: true
})


let wss = new Server({port: 8080})
wss.on('connection', (ws) => {
  ws.send("starting connection")
  // send latest 10 messages
  Message.findAll({
    limit: 10,
    order: "id DESC",
    raw: true
  }).then((messages) => {
    messages.reverse()
    messages.forEach((obj) => {
      ws.send(obj["text"])
    })
  })

  ws.on('message', (message) => {
    Message.create({text: message})
    wss.clients.forEach((client) => {
      client.send(message)
    })
  })
})

