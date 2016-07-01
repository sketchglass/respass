import * as React from "react";
import {thread} from "../thread";
import {IMessage} from "../../../common/data";

const MessageView = (props: {message: IMessage}) => {
  const {text, user} = props.message;
  return (
    <div className="message">
      <div className="user">{user.name}</div>
      <div className="text">{text}</div>
    </div>
  );
}

class MessageForm extends React.Component<{}, {}> {
  render() {
    const onKeyPress = this.onKeyPress.bind(this);
    return (
      <textarea className="message-form" onKeyPress={onKeyPress} />
    );
  }

  onKeyPress(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      const textarea = event.target as HTMLTextAreaElement;
      console.log("sending...");
      event.preventDefault();
      thread.newMessage(textarea.value);
      textarea.value = "";
    }
  }
}

interface ThreadViewState {
  messages?: IMessage[],
  connectionCount?: number;
}

export default
class ThreadView extends React.Component<{}, ThreadViewState> {

  constructor() {
    super();
    this.state = {
      messages: [],
      connectionCount: 0
    };
    thread.on("messageUpdate", () => {
      const {messages} = thread;
      this.setState({messages});
    });
    thread.on("connectionUpdate", () => {
      const {connectionCount} = thread;
      this.setState({connectionCount});
    });
  }

  render() {
    const {messages} = this.state;
    return (
      <div className="thread">
        <div className="connections">{this.state.connectionCount}</div>
        <div className="messages">
          {messages.map((msg, i) => <MessageView key={i} message={msg} />)}
        </div>
        <MessageForm />
      </div>
    );
  }

  newMessage() {
  }
}
