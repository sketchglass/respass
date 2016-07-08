process.env.PORT = 9090
process.env.FRONTEND_URL = "dummy"
process.env.SESSION_SECRET = "dummy"
process.env.TWITTER_CONSUMER_KEY = "dummy"
process.env.TWITTER_CONSUMER_SECRET = "dummy"
process.env.TWITTER_CALLBACK_URL = "dummy"

import * as request from "supertest"
import "../server/index"
import * as net from 'net'

describe("index", () => {
  it("start server listening at port 9090", done => {
    let client = net.connect({port: 9090}, () => {
      done()
      client.end()
    })
  })
})
