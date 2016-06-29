import { Server } from "ws"
import Sequelize = require("sequelize")

// define models
let sequelize = new Sequelize('sample','','',{dialect:'sqlite',storage:'./sample.db'})
let Message = sequelize.define('message', {
  text: Sequelize.STRING,
});
Message.sync()


let wss = new Server({port: 8080})
wss.on('connection', (ws) => {
  ws.send("starting connection")
  ws.on('message', (message) => {
    ws.send("received:" + message )
    Message.create({text: message}).then(() => {
      ws.send("saved" )
    })
  })
})

