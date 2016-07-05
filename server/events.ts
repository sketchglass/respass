import { ReceiveEventType, SendEventType } from "../common/eventType"
import { IMessage, IUser } from "../common/data";
import { Message, User } from "./models"

export let connection_number = 0

export
abstract class BaseReceiveEvent {
  ev: SendEventType
  constructor(protected user: IUser, protected value?: string) {
  }
  abstract prepare(): Promise<void>
  abstract response(): Promise<string>
}
export
class CreateMessageEvent extends BaseReceiveEvent{
  ev = SendEventType.NEW_MESSAGE

  async prepare() {
    const user = await User.findOne({
      where: {
        name: this.user.name
      },
    })
    await Message.create({
      text: this.value,
      userId: user.id
    })
  }
  async response() {
    if (this.value === "")
      return

    await this.prepare()

    return newMessage(this.ev, {
      text: this.value,
      user: {
        name: this.user.name
      }
    })
  }
}
export
class DeleteMessageEvent extends BaseReceiveEvent{
  ev = SendEventType.DELETE_MESSAGE
  async prepare() {
    await Message.destroy({where: {id: this.value}})
  }
  async response() {
    await this.prepare()
    return newMessage(this.ev, this.value)
  }
}
export
class JoinEvent extends BaseReceiveEvent {
  ev = SendEventType.USER_JOIN
  async prepare() {
  }
  async response() {
    await this.prepare()
    connection_number += 1
    return newMessage(this.ev, {
      "connections": connection_number
    })
  }
}
export
class LeftEvent extends BaseReceiveEvent {
  ev = SendEventType.USER_LEAVE
  async prepare() {
  }
  async response() {
    await this.prepare()
    connection_number -= 1
    return newMessage(this.ev, {
      "connections": connection_number
    })
  }
}
export
let newMessage = (ev: SendEventType, value: any) => {
  return JSON.stringify({
    ev: SendEventType[ev],
    value: value,
  })
}
