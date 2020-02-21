'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('modules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        isAlphanumeric: true,
        isLowercase: true
      },
      version: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        is: /^(\d+\.)?(\d+\.)?(\*|\d+)$/i
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable('modules')
  }
}
