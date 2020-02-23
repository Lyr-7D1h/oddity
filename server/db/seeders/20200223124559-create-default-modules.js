'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('modules', [
      {
        name: 'Forum',
        version: '0.1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Home',
        version: '0.1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Members',
        version: '0.1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Servers',
        version: '0.1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    const or = Sequelize.Op.or
    return queryInterface.bulkDelete('modules', {
      [or]: [
        { name: 'Forum' },
        { name: 'Home' },
        { name: 'Members' },
        { name: 'Servers' }
      ]
    })
  }
}
