require('dotenv').config();

import * as path from "path"
import * as express from "express"
import {app, server} from "./app"

app.use(express.static(path.join(__dirname, '../../ui/dist')))
import "./auth"
import "./api"
import "./wsserver"

server.listen(process.env.PORT)
