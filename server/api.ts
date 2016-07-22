import {Message, User, TwitterIntegration, Connection, messageToJSON} from "./models";
import {IMessage, IUser} from "../common/data";
import {app} from "./app";

app.get("/messages", async (req, res) => {
  const nextId = parseInt(req.query.nextId || 0)
  const limit = Math.min(parseInt(req.query.limit) || 100, 100)
  const where: any = {}
  if (nextId) {
    where['id'] = {$lt: nextId}
  }
  const messages = await Message.findAll({
    include: [User],
    order: '"message"."id" DESC', // <- TODO: fix Sequelize
    where, limit
  })
  const data = messages.map(m => messageToJSON(m, m.user!)).reverse()
  res.json(data)
})

app.get("/user", (req, res) => {
  const user: User|undefined = req.user
  if (user) {
    const json: IUser = {
      name: user.name,
      iconUrl: user.iconUrl
    };
    res.json(json);
  } else {
    res.json(null);
  }
});

app.get("/connections", async (req, res) => {
  let users = await User.findAll({
    where: ['"connections"."userId" IS NOT NULL'],
    include: [Connection]
  });
  let response: IUser[] = users.map(user => {
    return {
      name: user.name,
      iconUrl: user.iconUrl,
      connecting: true
    };
  });
  res.json(response);
});
