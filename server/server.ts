import * as http from "http";
import * as express from "express";
const cors = require("cors");
import {Message, User} from "./models";
import {IMessage} from "../common/data";
import path = require('path');

export const server = http.createServer();
const app = express();

app.use(cors());

// looks  odd, but this is exact where file is.
// (because all javascript files will be created under lib/)
app.use(express.static(path.join(__dirname, '../../ui/dist')));

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
