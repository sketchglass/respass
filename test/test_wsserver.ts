import {app} from "../server/app"
import * as WebSocket from "ws"

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
        
})

