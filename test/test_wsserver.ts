import {app, server} from "../server/app"
import * as WebSocket from "ws"
import * as assert from "power-assert"
import {Message, User, Connection} from "../server/models"


import "../server/wsserver"

describe("wsserver", () => {

  let ws1: WebSocket
  let ws2: WebSocket
  describe("without auth", () => {
    beforeEach(done => {
      server.listen(0, () => {
        let port = server.address().port
        ws1 = new WebSocket(`ws://127.0.0.1:${port}/`, {
          headers: {
            "Sec-WebSocket-Accept": "1",
            "Origin": `http://127.0.0.1:${port}`,
          }
        })
        ws2 = new WebSocket(`ws://127.0.0.1:${port}/`, {
          headers: {
            "Sec-WebSocket-Accept": "2",
            "Origin": `http://127.0.0.1:${port}`,
          }
        })
        done()
      })
    })
    afterEach(() => {
      server.close()
    })
    it("enables to connect", (done) => {
      ws1.on('open', () => {
        done()
      })
    })
    it("enables to disconnect", (done) => {
      ws1.on('open', () => {
        ws1.close()
      })
      ws1.on('close', (data) => {
        done()
      })
    })
    it("closes automatically when pong event is not received", function (done)  {
      this.timeout(10 * 1000)
      ws1.on('open', () => {
      })
      ws1.on('close', (data) => {
        done()
      })
    })
    it("cannot create any messages when user is anonymous", function (done)  {
      let messageCount = 0
      ws1.on('open', () => {
        ws1.send(JSON.stringify({
          "ev": "CREATE_MESSAGE",
          "value": "sample message"
        }))
        ws1.close()
      })
      ws1.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        switch(ev) {
          case "PING":
            const pong = {
              "ev": "PONG",
              "value": value
            }
            try {
              ws1.send(JSON.stringify(pong))
            } catch(e) {
              // nothing to do
            }
            break
          case "NEW_MESSAGE":
            messageCount++
            break
        }
      })
      ws1.on('close', (data) => {
        assert.equal(messageCount, 0)
        done()
      })
    })
    it("must not emit join event if anonymous user joins", function (done)  {
      let success = true
      setTimeout(() => {ws1.close()} ,1000)
      ws1.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        if (ev === "USER_JOIN") {
          success = false
          ws1.close()
        }
      })
      ws1.on('close', () => {
        assert.equal(success, true); done()
      })
    })
    it("must not emit left event if anonymous user leaves", function (done)  {
      let success = true
      ws2.on('open', () => {
        ws1.close()
      })
      ws2.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        if (ev === "USER_LEAVE") {
          success = false
        }
      })
      setTimeout(() => {ws2.close()} ,1000)
      ws2.on('close', () => {
        assert.equal(success, true); done()
      })
    })
  })
  describe("authed", () => {
    beforeEach(async (done) => {
      app.request.user = await User.create({
        name: "test",
      })
      server.listen(0, () => {
        let port = server.address().port
        ws1 = new WebSocket(`ws://127.0.0.1:${port}/`, {
          headers: {
            "Sec-WebSocket-Accept": "1",
            "Origin": `http://127.0.0.1:${port}`,
          }
        })
        ws2 = new WebSocket(`ws://127.0.0.1:${port}/`, {
          headers: {
            "Sec-WebSocket-Accept": "2",
            "Origin": `http://127.0.0.1:${port}`,
          }
        })
        done()
      })
    })
    afterEach(() => {
      server.close()
      app.request.user = null
    })
    it("can create messages up to 100 per hour if user is authed", async function (done)  {
      this.timeout(10 * 1000)
      let messageCount = 0
      ws1.on('open', () => {
        for (let i=0; i<200; i++) {
          ws1.send(JSON.stringify({
            "ev": "CREATE_MESSAGE",
            "value": "sample message"
          }))
        }
        ws1.close()
      })
      ws1.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        switch(ev) {
          case "PING":
            const pong = {
              "ev": "PONG",
              "value": value
            }
            try {
              ws1.send(JSON.stringify(pong))
            } catch(e) {
              // nothing to do
            }
            break
          case "NEW_MESSAGE":
            messageCount++
            break
        }
      })
      ws1.on('close', (data) => {
        assert.equal(messageCount, 100)
        done()
      })
    })
    it("did not close connection when ping event is successfully received", function (done)  {
      this.timeout(20 * 1000)
      let ping_times = 0
      let success = false

      ws1.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        switch(ev) {
          case "PING":
            const pong = {
              "ev": "PONG",
              "value": value
            }
            try {
              ws1.send(JSON.stringify(pong))
            } catch(e) {
              // nothing to do
            }
            ping_times++
            break
        }
        if (ping_times > 1) {
          success = true
          ws1.close()
        }
      })
      ws1.on('close', () => {
        assert.equal(success, true); done()
      })
    })
    it("must emit join event if user joins", function (done)  {
      let success = false

      ws1.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        if (ev === "USER_JOIN") {
          success = true
          ws1.close()
        }
      })
      ws1.on('close', () => {
        assert.equal(success, true); done()
      })
    })
    it("must emit left event if user leaves", function (done)  {
      this.timeout(20 * 1000)
      let success = false
      ws2.on('open', () => {
        ws1.close()
      })
      ws2.on('message', (data) => {
        const {ev, value} = JSON.parse(data)
        if (ev === "PING") {
          const pong = {
            "ev": "PONG",
            "value": value
          }
          try {
            ws2.send(JSON.stringify(pong))
          } catch(e) {
            // nothing to do
          }
        }
        if (ev === "USER_LEAVE") {
          success = true
          ws2.close()
        }
      })
      ws2.on('close', () => {
        assert.equal(success, true); done()
      })
    })
  })
})
