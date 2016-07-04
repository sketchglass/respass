require('dotenv').config()

import * as request from "supertest"
import {app} from "../server/app"
import "../server/api"
import {Message, User} from "../server/models"
import {IMessage} from "../common/data"

describe("server", () => {
  for (const model of [Message, User]) {
    model.sync({force: true})
  }

  before(async (done) => {
    try {
      const user = await User.create({name: "nyan"})
      await Message.create({text: "foo", userId: user.id})
      await Message.create({text: "bar", userId: user.id})
      await Message.create({text: "baz", userId: user.id})
      done()
    } catch (e) {
      done(e)
    }
  });

  describe("/messages", () => {

    it("returns all messages", done => {
      const expected: IMessage[] = [
        {text: "foo", user: {name: "nyan"}},
        {text: "bar", user: {name: "nyan"}},
        {text: "baz", user: {name: "nyan"}},
      ]
      request(app)
        .get("/messages")
        .expect(200, JSON.stringify(expected), done)
    })
  })

})
