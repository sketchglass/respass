import * as React from "react";
import * as moment from "moment"
import {thread} from "../thread";
import {auth} from "../auth";
import {IMessage, IUser} from "../../../common/data";
import * as autolinker from "autolinker"
import * as sanitizer from "sanitizer"
import "../notification"


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
        <ul>
          {users.map((user, i)=><li key={i}><img className="icon" src={user.iconUrl} /><span className="name">{user.name}</span></li>)}
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
  const linked = () => {
    return {
      __html: autolinker.link(sanitizer.escape(text))
    }
  }
  return (
    <div className="message">
      <img className="icon" src={user.iconUrl} />
      <div className="texts">
        <div className="info">
          <div className="user">{user.name}</div>
          <div className="time">{time}</div>
        </div>
        <div className="text" dangerouslySetInnerHTML={linked()} />
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
    thread.on("messageAppend", () => {
      const {messages} = thread;
      const atBottom = this.isAtBottom()
      this.setState({messages});
      if (atBottom) {
        this.scrollToBottom()
      }
    });
    thread.on("messagePrepend", () => {
      const {messages} = thread
      const oldHeight = document.body.scrollHeight
      this.setState({messages})
      const height = document.body.scrollHeight
      window.scrollBy(0, height - oldHeight)
    })
    thread.on("connectionUpdate", () => {
      const {connectionCount} = thread;
      this.setState({connectionCount});
    });
    window.addEventListener("scroll", () => this.onScroll())
  }

  onScroll() {
    const INFINITE_SCROLL_THRESHOLD = 500
    if (window.scrollY < INFINITE_SCROLL_THRESHOLD) {
      thread.fetchOlderMessages()
    }
  }

  isAtBottom() {
    return window.scrollY + window.innerHeight == document.body.scrollHeight
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  render() {
    const {messages} = this.state;
    return (
      <div className="app-container">
        <HeaderView />
        <div className="thread">
          <UserList />
          <div className="thread-container">
            <div className="messages-container">
              <div className="messages">
                {messages.map((msg, i) => <MessageView key={i} message={msg} />)}
              </div>
              <MessageForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  newMessage() {
  }
}
