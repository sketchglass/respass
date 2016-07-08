import * as express from "express"
import * as path from "path"
import * as http from "http"
import { Message, User, TwitterIntegration, Connection } from "./models"

// Connection must be cleaned up after restart server
Connection.destroy({where: {}})

export const app = express()
export const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '../../ui/dist')))
import "./auth"
import "./api"
import "./wsserver"
