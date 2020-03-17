'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('configs', [
      {
        id: 1,
        name: 'default',
        title: 'Oddity',
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
