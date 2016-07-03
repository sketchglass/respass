import { ReceiveEventType, SendEventType } from "../common/eventType" 
import { IMessage, IUser } from "../common/data";
import { Message, User } from "./models"

export let connection_number = 0

export
abstract class BaseReceiveEvent {
  ev: SendEventType
  constructor(protected user: IUser, protected value?: string) {
  }
  abstract prepare(): void
  abstract response(target: Function): void
}
export
class CreateMessageEvent extends BaseReceiveEvent{
  ev = SendEventType.NEW_MESSAGE

  prepare() {
    User.findOne({
      where: {
        name: this.user.name
      },
    }).then((user: any) => {
      Message.create({
        text: this.value,
        userId: user["id"]
      })
    })
  }
  response(target: Function) {
    if (this.value === "")
      return

    this.prepare()

    target(newMessage(this.ev, {
      text: this.value,
      user: {
        name: this.user.name
      }
    }))
  }
}
export
class DeleteMessageEvent extends BaseReceiveEvent{
  ev = SendEventType.DELETE_MESSAGE
  prepare() {
    Message.destroy({where: {id: this.value}})
  }
  response(target: Function) {
    this.prepare()
    return target(newMessage(this.ev, this.value) )
  }
}
export
class JoinEvent extends BaseReceiveEvent {
  ev = SendEventType.USER_JOIN
  prepare() {
    User.findOne({
      where: {
        name: this.user.name
      },
    }).then((user: any) => {
      user.connecting = true
      user.save()
    })
  }
  response(target: Function) {
    this.prepare()
    connection_number += 1
    return target(newMessage(this.ev, {
      "connections": connection_number
    }))
  }
}
export
class LeftEvent extends BaseReceiveEvent {
  ev = SendEventType.USER_LEAVE
  prepare() {
    User.findOne({
      where: {
        name: this.user.name
      },
    }).then((user: any) => {
      user.connecting = false
      user.save()
    })
  }
  response(target: Function) {
    this.prepare()
    connection_number -= 1
    return target(newMessage(this.ev, {
      "connections": connection_number
    }))
  }
}
export
let newMessage = (ev: SendEventType, value: any) => {
  return JSON.stringify({
    ev: SendEventType[ev],
    value: value,
  })
}
