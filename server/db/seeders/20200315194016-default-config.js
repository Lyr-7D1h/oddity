'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('configs', [
      {
        id: 1,
        name: 'default',
        title: 'Default',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('configs', [{ id: 1 }])
  }
}
