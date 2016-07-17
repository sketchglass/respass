require('dotenv').config();

import * as path from "path"
import * as express from "express"
import {app, server} from "./app"
const enforce = require('express-sslify')

if (process.env.NODE_ENV !== "development") {
  app.use(enforce.HTTPS({trustProtoHeader: true}))
}
app.use(express.static(path.join(__dirname, '../../ui/dist')))
import "./auth"
import "./api"
import "./wsserver"

server.listen(process.env.PORT)
