'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('roles', 'color', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('roles', 'color', Sequelize.INTEGER)
  },
}
