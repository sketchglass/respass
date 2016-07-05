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
    event.prepare = async () => {}
    it("should increase connection_number", async () => {
      assert.equal(events.connection_number, 0)
      await event.response()
      assert.equal(events.connection_number, 1)
    })
    it("returns connections", async () => {
      const val = await event.response()
      let parsed = JSON.parse(val)
      assert.equal(parsed.value.connections, events.connection_number)
    })
  })
  describe("LeftEvent", () => {
    let event = new events.LeftEvent(user)
    event.prepare = async () => {}
    it("should decrease connection_number", async () => {
      events.connection_number = 1
      assert.equal(events.connection_number, 1)
      await event.response()
      assert.equal(events.connection_number, 0)
    })
    it("returns connections", async () => {
      const val = await event.response()
      let parsed = JSON.parse(val)
      assert.equal(parsed.value.connections, events.connection_number)
    })
  })
  describe("CreateMessageEvent", () => {
    const message = "example"
    let event = new events.CreateMessageEvent(user, message)
    // override prepare methods for testing
    let prepare_called: boolean
    event.prepare = async () => { prepare_called = true }

    it("should call prepare", async () => {
      prepare_called = false
      assert.equal(prepare_called, false)
      await event.response()
      assert.equal(prepare_called, true)
    })
    it("returns correct message", async () => {
      const val = await event.response()
      let parsed = JSON.parse(val)
      assert.deepEqual(parsed, {
        ev: 'NEW_MESSAGE',
        value: { text: message, user: { name: user.name} }
      })
    })
  })
  describe("DeleteMessageEvent", () => {
    let event = new events.DeleteMessageEvent(user, "1")
    // override prepare methods for testing
    let prepare_called: boolean
    event.prepare = async () => { prepare_called = true }

    it("should call prepare", async () => {
      prepare_called = false
      assert.equal(prepare_called, false)
      await event.response()
      assert.equal(prepare_called, true)
    })
    it("returns correct message", async () => {
      const val = await event.response()
      let parsed = JSON.parse(val)
      assert.deepEqual(parsed, { ev: 'DELETE_MESSAGE', value: '1' })
    })
  })
})
