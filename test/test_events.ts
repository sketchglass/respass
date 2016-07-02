import * as assert from "power-assert"
import * as events from "../server/events"
import { IMessage, IUser } from "../common/data";
import { ReceiveEventType, SendEventType } from "../common/eventType" 

let user: IUser = {
  name: "sample user"
}

describe("events", () => {
  describe("JoinEvent", () => {
    let event = new events.JoinEvent(user)
    it("should increase connection_number", () => {
      assert.equal(events.connection_number, 0)
      event.response(() => {})
      assert.equal(events.connection_number, 1)
    })
    it("returns connections", () => {
      event.response((val: string) => {
        let parsed = JSON.parse(val)
        assert.equal(parsed.value.connections, events.connection_number)
      })
    })
  })
  describe("LeftEvent", () => {
    let event = new events.LeftEvent(user)
    it("should decrease connection_number", () => {
      events.connection_number = 1
      assert.equal(events.connection_number, 1)
      event.response(() => {})
      assert.equal(events.connection_number, 0)
    })
    it("returns connections", () => {
      event.response((val: string) => {
        let parsed = JSON.parse(val)
        assert.equal(parsed.value.connections, events.connection_number)
      })
    })
  })
})
