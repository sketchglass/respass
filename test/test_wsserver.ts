import {app} from "../server/app"
import * as WebSocket from "ws"

let port: number
import "../server/wsserver"
app.listen(0, null, null, function() {
  port = this.address().port
})

describe("wsserver", () => {

  let ws1: WebSocket
  let ws2: WebSocket
  beforeEach(() => {
    ws1 = new WebSocket(`ws://127.0.0.1:${port}/`, {
      headers: { "Sec-WebSocket-Accept": "1" }
    })
    ws2 = new WebSocket(`ws://127.0.0.1:${port}/`, {
      headers: { "Sec-WebSocket-Accept": "2" }
    })
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
  it("did not close connection when ping event is successfully received", function (done)  {
    this.timeout(10 * 1000)
    let ping_times = 0

    ws1.on('message', (data) => {
      const {ev, value} = JSON.parse(data)
      switch(ev) {
        case "PING":
          const pong = {
            "ev": "PONG",
            "value": value
          }
          ws1.send(JSON.stringify(pong))
          ping_times++
          break
      }
      if (ping_times > 1) {
        ws1.close()
        done()
      }
    })
  })
  it("must be emit join event if user joins", function (done)  {
    this.timeout(1 * 1000)
    ws1.on('message', (data) => {
      const {ev, value} = JSON.parse(data)
      if (ev === "USER_JOIN") {
        ws1.close()
        done()
      }
    })
  })
  it("must be emit left event if user leaves", function (done)  {
    this.timeout(2 * 1000)
    ws2.on('message', (data) => {
      const {ev, value} = JSON.parse(data)
      if (ev === "USER_JOIN") {
        ws1.close()
      }
      if (ev === "USER_LEAVE") {
        ws2.close()
        done()
      }
    })
  })
})

