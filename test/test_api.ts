import * as request from "supertest"
import {app} from "../server/app"
import {Message, User, Connection} from "../server/models"
import {IMessage, IUser} from "../common/data"

describe("api", () => {
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
    user2 = await User.create({name: "bob", iconUrl: "some_url"})
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
        {text: "foo", user: {name: "alice", iconUrl: null}, createdAt: message1.createdAt.toString()},
        {text: "bar", user: {name: "alice", iconUrl: null}, createdAt: message2.createdAt.toString()},
        {text: "baz", user: {name: "bob", iconUrl: "some_url"}, createdAt: message3.createdAt.toString()},
      ]
      request(app)
        .get("/messages")
        .expect(200, JSON.stringify(expected), done)
    })
  })

  describe("/connections", () => {
    it("returns all connections without duplicate", done => {
      const expected: IUser[] = [
        {name: "alice", iconUrl: null, connecting: true},
        {name: "bob", iconUrl: "some_url", connecting: true},
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

  describe("/user", () => {
    it("returns null when user is not authed", done => {
      const expected: any = null
      request(app)
        .get("/user")
        .expect(200, JSON.stringify(expected), done)
    })
    it("returns user when user is authed", done => {
      const expected = {
        "name":"bob","iconUrl":"some_url"
      }
      // fake user
      app.request.user = user2
      request(app)
        .get("/user")
        .expect(200, JSON.stringify(expected), (err, res) => {
          app.request.user = null
          done(err)
        })
    })
  })

})
