import {thread} from "./thread";
import {IMessage} from "../../common/data";

// workaround (should be fixed)
declare let Notification: any;

if (window["Notification"]) {
  Notification.requestPermission()

  const notify = (msg: IMessage) => {
    const options = {
      body: msg.text,
      icon: msg.user.iconUrl,
    }
    let notification = new Notification(`New Message from @${msg.user.name}`, options)
    notification.onclick = (e: any) => {
      window.focus()
    }
  }

  thread.on("messageAppend", () => {
    const {latestMessage, currentUser} = thread;
    if(latestMessage
       && latestMessage.user.name !== currentUser.name
       && !window.document.hasFocus())
      notify(latestMessage)
  })
}
