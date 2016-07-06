import * as React from "react";
import * as moment from "moment"
import {thread} from "../thread";
import {auth} from "../auth";
import {IMessage, IUser} from "../../../common/data";

interface UserListState {
  users: IUser[];
}

class UserList extends React.Component<{}, UserListState> {
  constructor() {
    super();
    this.state = {
      users: []
    };
    thread.on("connectionUpdate", () => {
      this.setState({
        users: thread.availableUsers
      });
    });
  }

  render() {
    const {users} = this.state;
    return (
      <div className="user-list">
        <div>Available users:</div>
        <ul>
          {users.map((user, i)=><li key={i}>{user.name}</li>)}
        </ul>
      </div>
    );
  }
}

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
  const {text, user, createdAt} = props.message;
  const time = moment(createdAt).format("MMM Do, h:mm A")
  return (
    <div className="message">
      <img className="icon" src={user.iconUrl} />
      <div className="texts">
        <div className="info">
          <div className="user">{user.name}</div>
          <div className="time">{time}</div>
        </div>
        <div className="text">{text}</div>
      </div>
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


const HeaderView = () => {
  return <div className="header">
    <div className="app-name">respass</div>
    <UserView />
  </div>
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
        <HeaderView />
        <div className="thread-container">
          <UserList />
          <div className="messages-container">
            <div className="messages">
              {messages.map((msg, i) => <MessageView key={i} message={msg} />)}
            </div>
            <MessageForm />
          </div>
        </div>
      </div>
    );
  }

  newMessage() {
  }
}
