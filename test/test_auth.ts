// fake process.env
process.env.FRONTEND_URL = "dummy"
process.env.SESSION_SECRET = "dummy"
process.env.TWITTER_CONSUMER_KEY = "dummy"
process.env.TWITTER_CONSUMER_SECRET = "dummy"
process.env.TWITTER_CALLBACK_URL = "dummy"

import * as request from "supertest"
import {app} from "../server/app"
import "../server/auth"

describe("auth", () => {
  // Due to dummy environment variables, it raises internal error.
  describe("/auth/twitter", () => {
    it("exists", done => {
      request(app)
        .get("/auth/twitter")
        .expect(500, done)
    })
  })
  describe("/auth/twitter/callback", () => {
    it("exists", done => {
      request(app)
        .get("/auth/twitter/callback")
        .expect(500, done)
    })
  })
  describe("/logout", () => {
    it("exists", done => {
      request(app)
        .get("/logout")
        .expect("Location", "dummy", done)
    })
  })
})
