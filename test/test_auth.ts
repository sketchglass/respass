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
