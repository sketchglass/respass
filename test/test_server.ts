import * as request from "supertest"
import {app} from "../server/app"
import "../server/api"
import {Message, User, Connection} from "../server/models"
import {IMessage, IUser} from "../common/data"

describe("server", () => {
  let user1: User
  let user2: User
  let user3: User
  let message1: Message
  let message2: Message
  let message3: Message

  beforeEach(async () => {
    for (const model of [Message, User, Connection]) {
      await model.sync({force: true})
    }
    user1 = await User.create({name: "alice"})
    user2 = await User.create({name: "bob"})
    user3 = await User.create({name: "carol"})
    message1 = await Message.create({text: "foo", userId: user1.id})
    message2 = await Message.create({text: "bar", userId: user1.id})
    message3 = await Message.create({text: "baz", userId: user2.id})
    await Connection.create({userId: user1.id})
    await Connection.create({userId: user1.id})
    await Connection.create({userId: user2.id})
  });


  describe("/messages", () => {

    it("returns all messages", done => {
      const expected: IMessage[] = [
        {text: "foo", user: {name: "alice"}, createdAt: message1.createdAt.toString()},
        {text: "bar", user: {name: "alice"}, createdAt: message2.createdAt.toString()},
        {text: "baz", user: {name: "bob"}, createdAt: message3.createdAt.toString()},
      ]
      request(app)
        .get("/messages")
        .expect(200, JSON.stringify(expected), done)
    })
  })

  describe("/connections", () => {
    it("returns all connections without duplicate", done => {
      const expected: IUser[] = [
        {name: "alice", connecting: true},
        {name: "bob", connecting: true},
      ]
      request(app)
        .get("/connections")
        .expect(200, JSON.stringify(expected), done)
    })
    it("returns empty when there is no available connection", done => {
      Connection.destroy({where: {}})
      request(app)
        .get("/connections")
        .expect(200, JSON.stringify([]), done)
    })
  })

})
