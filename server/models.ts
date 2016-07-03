import Sequelize = require("sequelize")

export let sequelize = new Sequelize('sample','','',{dialect:'sqlite',storage:'./sample.db'})

interface MessageParams {
  text?: string;
  userId?: number;
  id?: number;
}
export interface Message extends Sequelize.Instance<Message, MessageParams>, MessageParams {
}

export let Message = sequelize.define<Message, {}>('message', {
  text: Sequelize.STRING,
})

interface UserParams {
  name?: string;
  id?: number;
}
export interface User extends Sequelize.Instance<User, UserParams>, UserParams {
}

export let User = sequelize.define<User, UserParams>('user', {
  name: Sequelize.STRING,
})

interface ConnectionParams {
  available?: boolean;
  userId?: number;
}
export interface Connection extends Sequelize.Instance<Connection, ConnectionParams>, ConnectionParams {
}

export let Connection = sequelize.define<Connection, ConnectionParams>('connection', {
  available: Sequelize.BOOLEAN
})

interface TwitterIntegrationParams {
  twitterId?: string;
  userId?: number;
  id?: number;
}
export interface TwitterIntegration extends Sequelize.Instance<TwitterIntegration, TwitterIntegrationParams>, TwitterIntegrationParams {
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
