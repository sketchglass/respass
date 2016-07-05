export
interface IMessage {
  text: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export
interface IUser {
  name: string,
  connecting?: boolean,
}
