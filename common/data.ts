export
interface IMessage {
  text: string;
  user: {
    name: string;
  };
}

export
interface IUser {
  name: string,
  connecting?: boolean,
}
