import Sequelize = require("sequelize")

export let sequelize = new Sequelize('sample','','',{dialect:'sqlite',storage:'./sample.db'})
export let Message = sequelize.define('message', {
  text: Sequelize.STRING,
})

export let User = sequelize.define('user', {
  name: Sequelize.STRING,
})

export let Connection = sequelize.define('connection', {
  available: Sequelize.BOOLEAN
})

export let TwitterIntegration = sequelize.define('twitterIntegration', {
  twitterId: Sequelize.STRING,
})

User.hasMany(Connection)
Connection.belongsTo(User)
User.hasMany(Message)
Message.belongsTo(User)
User.hasOne(TwitterIntegration)
TwitterIntegration.belongsTo(User)
