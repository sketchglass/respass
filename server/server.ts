import * as http from "http";
import * as express from "express";
import {Message} from "./models";

export const server = http.createServer();
const app = express();

app.get("/messages", async (req, res) => {
  const messages = await Message.findAll({
    order: "createdAt",
    raw: true
  });
  res.json(messages);
});

server.on("request", app);
