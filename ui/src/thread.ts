import {EventEmitter} from "events";
import {NewMessageEvent, CreateMessageEvent} from "../../common/events";
import {IMessage} from "../../common/data";

const API_SERVER = "localhost:8080";

export
class Thread extends EventEmitter {
  connetion = new WebSocket(`ws://${API_SERVER}`);
  messages: IMessage[] = [];
  connection_number: number = 0

  constructor() {
    super();
    this.connetion.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.ev) {
        case "NEW_MESSAGE":
          const newMessage = message as NewMessageEvent;
          console.log("message received:", message);
          this.messages.push(message.value);
          this.emit("message_update");
          break;
        case "USER_JOIN":
        case "USER_LEAVE":
          const connection_number = message.value.connections
          this.connection_number = connection_number
          this.emit("connection_update")
          break;
        default:
          break;
        }
      } catch (error) {
        console.error(error);
      }
    }
    // TODO: メッセージを取りこぼさないようにする
    this.fetchAllMessages();
  }

  async fetchAllMessages() {
    const response = await fetch(`http://${API_SERVER}/messages`);
    const messages: IMessage[] = await response.json();
    this.messages.push(...messages);
    this.emit("message_update");
  }

  newMessage(message: string) {
    const createMessage: CreateMessageEvent = {
      ev: "CREATE_MESSAGE",
      value: message
    };
    this.connetion.send(JSON.stringify(createMessage));
  }
}

export
const thread = new Thread();
