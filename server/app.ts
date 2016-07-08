import * as express from "express"
import * as http from "http"
import { Message, User, TwitterIntegration, Connection } from "./models"

// Connection must be cleaned up after restart server
Connection.destroy({where: {}})

process.on('uncaughtException', (err: any) => {
  console.warn(`Caught exception: ${err}`);
})

process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
    console.warn("Unhandled Rejection at: Promise ", p, " reason: ", reason);
})

export const app = express()
export const server = http.createServer(app)
