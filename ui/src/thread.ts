import {EventEmitter} from "events";
import {NewMessageEvent, CreateMessageEvent} from "../../common/events";
import {IMessage} from "../../common/data";

const API_SERVER = `${window.location.hostname}:8080`;

export
class Thread extends EventEmitter {
  connetion = new WebSocket(`ws://${API_SERVER}`);
  messages: IMessage[] = [];
  connectionCount = 0

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
          this.emit("messageUpdate");
          break;
        case "USER_JOIN":
        case "USER_LEAVE":
          const connectionCount = message.value.connections
          this.connectionCount = connectionCount
          this.emit("connectionUpdate")
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
    this.emit("messageUpdate");
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
