'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('modules', 'enabled', Sequelize.BOOLEAN, {
      after: 'version'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('modules', 'enabled')
  }
}
