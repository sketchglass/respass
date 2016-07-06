import * as Sequelize from "sequelize"

const migration = {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.addColumn("users", "iconUrl", Sequelize.STRING)
  },
  down: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.removeColumn("users", "iconUrl")
  }
}

export = migration
