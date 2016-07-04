import * as request from "supertest"
import {app} from "../server/app"
import "../server/api"
import {Message, User, Connection} from "../server/models"
import {IMessage, IUser} from "../common/data"

describe("server", () => {

  beforeEach(async () => {
    for (const model of [Message, User, Connection]) {
      await model.sync({force: true})
    }
    const user1 = await User.create({name: "alice"})
    const user2 = await User.create({name: "bob"})
    const user3 = await User.create({name: "carol"})
    await Message.create({text: "foo", userId: user1.id})
    await Message.create({text: "bar", userId: user1.id})
    await Message.create({text: "baz", userId: user2.id})
    await Connection.create({userId: user1.id})
    await Connection.create({userId: user1.id})
    await Connection.create({userId: user2.id})
  });


  describe("/messages", () => {

    it("returns all messages", done => {
      const expected: IMessage[] = [
        {text: "foo", user: {name: "alice"}},
        {text: "bar", user: {name: "alice"}},
        {text: "baz", user: {name: "bob"}},
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
      Connection.sync({force: true})
      request(app)
        .get("/connections")
        .expect(200, JSON.stringify([]), done)
    })
  })

})
