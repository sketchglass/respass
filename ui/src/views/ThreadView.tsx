import * as React from "react";
import {thread} from "../thread";
import {auth} from "../auth";
import {IMessage, IUser} from "../../../common/data";

interface UserViewState {
  user?: IUser;
  loggedOut?: boolean;
}

class UserView extends React.Component<{}, UserViewState> {
  constructor() {
    super();
    this.state = {
      user: null,
      loggedOut: false
    };
    auth.on("change", () => {
      this.setState({
        user: auth.user,
        loggedOut: auth.loggedOut
      });
    });
  }

  render() {
    const {user, loggedOut} = this.state;

    if (user) {
      const signOut = () => auth.logOut();
      return (
        <div className="user-view">
          <div className="name">{user.name}</div>
          <a href="#" className="sign-out" onClick={signOut}>Log Out</a>
        </div>
      )
    } else if (loggedOut) {
      const signIn = () => auth.logIn();
      return (
        <div className="user-view">
          <a href="#" className="sign-in" onClick={signIn}>Log In</a>
        </div>
      )
    } else {
      return (
        <div className="user-view">
        </div>
      )
    }
  }
}

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
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      if (textarea.value !== "") {
        thread.newMessage(textarea.value);
        textarea.value = "";
      }
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
        <UserView />
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
