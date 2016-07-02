import { ReceiveEventType, SendEventType } from "../common/eventType" 
import { IMessage, IUser } from "../common/data";
import { Message, User } from "./models"

export let connection_number = 0

export
abstract class BaseReceiveEvent {
  constructor(protected user: IUser, protected ev?: ReceiveEventType, protected value?: string) {
  }
  abstract response(target: Function): void
}
export
class CreateMessageEvent extends BaseReceiveEvent{
  response(target: Function) {
    if (this.value === "")
      return
        
    User.findOne({
      where: {
        name: this.user.name
      },
      raw: true
    }).then((user) => {
      Message.create({
        text: this.value,
        // omg wtf...
        userId: (<any>user)["id"]
      })
    })

    target(newMessage(SendEventType.NEW_MESSAGE, {
      text: this.value,
      user: {
        name: this.user.name
      }
    }))
  }
}
export
class DeleteMessageEvent extends BaseReceiveEvent{
  response(target: Function) {
    Message.destroy({where: {id: this.value}})
    return target(newMessage(SendEventType.DELETE_MESSAGE, this.value) )
  }
}
export
class JoinEvent extends BaseReceiveEvent {
  response(target: Function) {
    connection_number += 1
    return target(newMessage(SendEventType.USER_JOIN, {
      "connections": connection_number
    }))
  }
}
export
class LeftEvent extends BaseReceiveEvent {
  response(target: Function) {
    connection_number -= 1
    return target(newMessage(SendEventType.USER_LEAVE, {
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
