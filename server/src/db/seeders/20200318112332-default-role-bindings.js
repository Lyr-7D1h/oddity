'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roleBindings', [
      {
        userId: 1,
        roleId: 1,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        userId: 2,
        roleId: 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roleBindings', {
      [Sequelize.Op.or]: [
        { userId: 1, roleId: 1 },
        { userId: 2, roleId: 2 },
      ],
    })
  },
}
