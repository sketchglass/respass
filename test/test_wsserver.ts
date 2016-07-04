import {app} from "../server/app"
import * as WebSocket from "ws"
// import * as http from "http"

// wip
//
// import "../server/wsserver"
// let server = http.createServer(app);
// server.listen(0);
// const port = server.address().port

const port = 8328
import "../server/wsserver"
app.listen(port)
describe("wsserver", () => {

  let ws: WebSocket
  beforeEach(() => {
    ws = new WebSocket(`ws://127.0.0.1:${port}/`)
  })
  it("enables to connect", (done) => {
    ws.on('open', () => {
      done()
    })
  })
  it("enables to disconnect", (done) => {
    ws.on('open', () => {
      ws.close()
    })
    ws.on('close', (data) => {
      done()
    })
  })
  it("closes automatically when pong event is not received", function (done)  {
    this.timeout(10 * 1000)
    ws.on('open', () => {
    })
    ws.on('close', (data) => {
      done()
    })
  })
  it("did not close connection when ping event is successfully received", function (done)  {
    this.timeout(10 * 1000)
    let ping_times = 0

    ws.on('message', (data) => {
      const {ev, value} = JSON.parse(data)
      switch(ev) {
        case "PING":
          const pong = {
            "ev": "PONG",
            "value": value
          }
          ws.send(JSON.stringify(pong))
          ping_times++
          break
      }
      if (ping_times > 1) {
        done()
      }
    })
  })
        
})

