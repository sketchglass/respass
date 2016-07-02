import {EventEmitter} from "events";
import {NewMessageEvent, CreateMessageEvent} from "../../common/events";
import {IMessage} from "../../common/data";
const ReconnectingWebSocket: typeof WebSocket = require("ReconnectingWebSocket");

const API_SERVER = `${window.location.hostname}:8080`;

export
class Thread extends EventEmitter {
  connetion = new ReconnectingWebSocket(`ws://${API_SERVER}`);
  messages: IMessage[] = [];
  connectionCount = 0

  constructor() {
    super();
    this.connetion.onopen = () => {
      this.fetchAllMessages();
    };
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
        case "PING":
          const pingId: number = message.value
          this.pong(pingId)
        default:
          break;
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  async fetchAllMessages() {
    const response = await fetch(`http://${API_SERVER}/messages`);
    const messages: IMessage[] = await response.json();
    this.messages = messages;
    this.emit("messageUpdate");
  }

  newMessage(message: string) {
    const createMessage: CreateMessageEvent = {
      ev: "CREATE_MESSAGE",
      value: message
    };
    this.connetion.send(JSON.stringify(createMessage));
  }

  pong(pingId: number) {
    const pongMessage = {
      ev: "PONG",
      value: pingId
    }
    this.connetion.send(JSON.stringify(pongMessage))
  }
}

export
const thread = new Thread();
