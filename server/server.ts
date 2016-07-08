import * as express from "express"
import * as path from "path"
import { Message, User, TwitterIntegration, Connection } from "./models"

// Connection must be cleaned up after restart server
Connection.destroy({where: {}})

import { app } from "./app"
app.use(express.static(path.join(__dirname, '../../ui/dist')))
import "./auth"
import "./api"
import "./wsserver"

export const listen = (port: number) => {
  return new Promise((resolve, reject) => {
    const listener = app.listen(port, () => {
      resolve(listener.address().port)
    })
  })
}
