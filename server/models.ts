import Sequelize = require("sequelize")
import {IMessage, IUser} from "../common/data"

const config = require("../../config/db")[process.env.NODE_ENV || "development"]
export let sequelize = new Sequelize(config.url)

interface MessageParams {
  text?: string
  userId?: number
  id?: number
  createdAt?: Date
}
export interface Message extends Sequelize.Instance<MessageParams> {
  user?: User
  text: string
  userId: number
  id: number
  createdAt: Date
}

export let Message = sequelize.define<Message, {}>('message', {
  text: Sequelize.STRING,
})

export function messageToJSON(message: Message, user: IUser|User): IMessage {
  return {
    id: message.id,
    text: message.text,
    user: {
      name: user.name,
      iconUrl: user.iconUrl
    },
    createdAt: message.createdAt.toString(),
  }
}

interface UserParams {
  name?: string
  id?: number
  iconUrl?: string
}
export interface User extends Sequelize.Instance<UserParams> {
  messages?: Message[]
  connections?: Connection[]
  twitterIntegration?: TwitterIntegration
  name: string
  id: number
  iconUrl: string|null
}

export let User = sequelize.define<User, UserParams>('user', {
  name: Sequelize.STRING,
  iconUrl: Sequelize.STRING,
})

interface ConnectionParams {
  available?: boolean
  userId?: number
  id?: number
}
export interface Connection extends Sequelize.Instance<ConnectionParams> {
  user?: User
  available: boolean
  userId: number
  id: number
}

export let Connection = sequelize.define<Connection, ConnectionParams>('connection', {
  available: Sequelize.BOOLEAN
})

interface TwitterIntegrationParams {
  twitterId?: string
  userId?: number
  id?: number
}
export interface TwitterIntegration extends Sequelize.Instance<TwitterIntegrationParams> {
  user?: User
  twitterId: string
  userId: number
  id: number
}

export let TwitterIntegration = sequelize.define<TwitterIntegration, TwitterIntegrationParams>('twitterIntegration', {
  twitterId: Sequelize.STRING,
})

User.hasMany(Connection)
Connection.belongsTo(User)
User.hasMany(Message)
Message.belongsTo(User)
User.hasOne(TwitterIntegration)
TwitterIntegration.belongsTo(User)
