'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'User',
        isDefault: true,
        color: '#ffffff',
        permissions: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin',
        isDefault: false,
        color: '#ffffff',
        permissions: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', {
      [Sequelize.Op.or]: [{ name: 'User' }, { name: 'Admin' }],
    })
  },
}
