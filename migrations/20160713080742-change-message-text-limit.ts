import * as Sequelize from "sequelize"

const migration = {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.changeColumn("messages", "text", {
      type: Sequelize.TEXT
    })
  },
  down: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.removeColumn("messages", "text")
    await queryInterface.addColumn("messages", "text", Sequelize.STRING)
  }
}

export = migration
