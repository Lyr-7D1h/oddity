'use strict'

module.exports = {
  up: (queryInterface, sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'User',
        isDefault: true,
        color: '#ffffff',
        permissions: 1,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW'),
      },
      {
        name: 'Admin',
        isDefault: false,
        color: '#ffffff',
        permissions: 2,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW'),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', {
      [Sequelize.Op.or]: [{ name: 'User' }, { name: 'Admin' }],
    })
  },
}
