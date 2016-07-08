import * as express from "express"
import * as http from "http"
import { Message, User, TwitterIntegration, Connection } from "./models"

// Connection must be cleaned up after restart server
Connection.destroy({where: {}})

process.on('uncaughtException', (err: any) => {
  console.warn(`Uncaught Exception: ${err}`);
  console.warn(err.stack)
})

process.on('unhandledRejection', (err: any, p: Promise<any>) => {
  console.warn(`Unhandled Rejection: ${err}`);
  console.warn(err.stack)
})

export const app = express()
export const server = http.createServer(app)
