import * as Sequelize from "sequelize"

const migration = {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.addColumn("Users", "iconUrl", Sequelize.STRING)
  },
  down: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.removeColumn("Users", "iconUrl")
  }
}

export = migration
