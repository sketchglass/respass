export
interface IMessage {
  text: string
  user: IUser
  createdAt: string
}

export
interface IUser {
  name: string
  iconUrl: string
  connecting?: boolean
}
