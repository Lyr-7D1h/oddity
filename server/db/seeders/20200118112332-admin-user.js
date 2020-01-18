'use strict'

const bcrypt = require('bcrypt')

const hash = bcrypt.hashSync('admin', 12)

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'Admin',
        identifier: 'admin',
        password: hash,
        email: 'admin@admin.com',
        ip: '0:0:0:0',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', { identifier: 'admin' }, {})
  }
}
