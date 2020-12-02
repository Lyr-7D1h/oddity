'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roleBindings', [
      {
        userId: 1,
        roleId: 1,
      },
      {
        userId: 2,
        roleId: 2,
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
