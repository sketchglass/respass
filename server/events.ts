import { ReceiveEventType, SendEventType } from "../common/eventType"
import { IMessage, IUser } from "../common/data";
import { Message, User, messageToJSON } from "./models"
import { messageTextLimit } from "../common/config"

export let connection_number = 0

export function setConnectionNumber(num: number) {
  connection_number = num;
}

export
abstract class BaseReceiveEvent {
  ev: SendEventType
  constructor(protected user: IUser, protected value?: string) {
  }
  abstract prepare(): Promise<void>
  abstract response(): Promise<string>
}
export
class WhoamiEvent extends BaseReceiveEvent{
  ev = SendEventType.WHOAMI

  async prepare() {
  }
  async response() {
    return newMessage(this.ev, this.user)
  }
}
export
class CreateMessageEvent extends BaseReceiveEvent{
  ev = SendEventType.NEW_MESSAGE
  message: Message

  async prepare() {
    const user = await User.findOne({
      where: {
        name: this.user.name
      },
    })
    this.message = await Message.create({
      text: this.value,
      userId: user.id
    })
  }
  async response() {
    if (this.value === "" || this.value.length > messageTextLimit)
      return

    await this.prepare()

    let message = messageToJSON(this.message, this.user)

    return newMessage(this.ev, message)
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
      connections: connection_number,
      user: this.user
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
