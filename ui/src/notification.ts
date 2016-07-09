import {thread} from "./thread";
import {IMessage} from "../../common/data";

// workaround (should be fixed)
declare let Notification: any;


Notification.requestPermission()


const notify = (msg: IMessage) => {
  const options = {
    body: msg.text,
    icon: msg.user.iconUrl,
  }
  return new Notification(`New Message from @${msg.user.name}`, options)
}


thread.on("messageAppend", () => {
  const {latestMessage, currentUser} = thread;
  if(latestMessage && latestMessage.user.name !== currentUser.name)
    notify(latestMessage)
});
