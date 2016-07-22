import { ReceiveEventType, SendEventType } from "../common/eventType"
import { IMessage, IUser } from "../common/data";
import { Message, User, messageToJSON } from "./models"
import { messageTextLimit } from "../common/config"

export let connection_number = 0

export function setConnectionNumber(num: number) {
  connection_number = num;
}

export
interface ReceiveEvent {
  ev: SendEventType

  prepare(): Promise<void>
  response(): Promise<string|undefined>
}
export
class WhoamiEvent implements ReceiveEvent {
  ev = SendEventType.WHOAMI

  constructor(public user: IUser) {
  }

  async prepare() {
  }
  async response() {
    return newMessage(this.ev, this.user)
  }
}
export
class CreateMessageEvent implements ReceiveEvent {
  ev = SendEventType.NEW_MESSAGE
  message: Message

  constructor(public user: IUser, public value: string) {
  }

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
class DeleteMessageEvent implements ReceiveEvent {
  ev = SendEventType.DELETE_MESSAGE

  constructor(public id: number) {
  }

  async prepare() {
    await Message.destroy({where: {id: this.id}})
  }
  async response() {
    await this.prepare()
    return newMessage(this.ev, this.id)
  }
}
export
class JoinEvent implements ReceiveEvent {
  ev = SendEventType.USER_JOIN

  constructor(public user: IUser) {
  }

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
class LeftEvent implements ReceiveEvent {
  ev = SendEventType.USER_LEAVE

  constructor(public user: IUser) {
  }

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
