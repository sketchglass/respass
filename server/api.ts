import {Message, User, TwitterIntegration, Connection} from "./models";
import {IMessage, IUser} from "../common/data";
import {app} from "./app";

app.get("/messages", async (req, res) => {
  const messages = await Message.findAll({
    include: [User],
    //order: "createdAt", <- this doesn't work ???
  });
  const data: IMessage[] = messages.map(m => ({
    text: m.text,
    user: {name: m.user.name}
  }));
  res.json(data);
});


app.get("/user", (req, res) => {
  if (req.user) {
    const json: IUser = {
      name: req.user.name
    };
    res.json(json);
  } else {
    res.json(null);
  }
});

app.get("/connections", async (req, res) => {
  let users = await User.findAll({include: [Connection]});
  let response: IUser[] = users.filter(user => user.connections.length !== 0).map(user => {
    return {
      name: user.name,
      connecting: user.connections.length !== 0
    };
  });
  res.json(response);
});
