import Sequelize = require("sequelize")

export let sequelize = new Sequelize('sample','','',{dialect:'sqlite',storage:'./sample.db'})
export let Message = sequelize.define('message', {
  text: Sequelize.STRING,
})
