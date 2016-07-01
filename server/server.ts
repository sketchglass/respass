import * as http from "http";
import * as express from "express";
import {Message, User} from "./models";
import {IMessage} from "../common/data";

export const server = http.createServer();
const app = express();

app.get("/messages", async (req, res) => {
  const messages: any[] = await Message.findAll({
    include: [User],
    //order: "createdAt", <- this doesn't work ???
  });
  const data: IMessage[] = messages.map(m => ({
    text: m.text,
    user: {name: m.user.name}
  }));
  res.json(data);
});

server.on("request", app);
