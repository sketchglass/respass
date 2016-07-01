import {IMessage} from "./data";

export
interface NewMessageEvent {
  ev: "NEW_MESSAGE";
  value: IMessage;
}

export
interface CreateMessageEvent {
  ev: "CREATE_MESSAGE";
  value: string;
}
