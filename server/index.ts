import * as express from "express"
import * as path from "path"
import { Message, User, TwitterIntegration, Connection } from "./models"

require('dotenv').config();

let IS_PROD: boolean = process.env.NODE_ENV === "production"

// define models
for (const model of [Message, TwitterIntegration, User]) {
  model.sync({
    force: !IS_PROD
  })
}
// Connection must be cleaned up after restart server
Connection.sync({force: true})

import { app } from "./app"
app.use(express.static(path.join(__dirname, '../../ui/dist')))
import "./auth"
import "./api"
import "./wsserver"

app.listen(8080);
