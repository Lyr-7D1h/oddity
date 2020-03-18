'use strict'

const bcrypt = require('bcrypt')

const hash = bcrypt.hashSync('admin', 12)

module.exports = {
  up: queryInterface => {
    return new Promise((resolve, reject) => {
      queryInterface.sequelize
        .query(`SELECT * FROM "roles" WHERE name='Admin'`)
        .then(([roles]) => {
          if (roles.length === 1) {
            return queryInterface
              .bulkInsert('users', [
                {
                  username: 'Admin',
                  identifier: 'admin',
                  password: hash,
                  email: 'admin@admin.com',
                  roleId: roles[0].id,
                  ip: '0:0:0:0',
                  permissions: 0x1,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ])
              .then(() => resolve())
              .catch(err => reject(err))
          } else {
            reject(new Error('Could not find Admin Role'))
          }
        })
        .catch(err => reject(err))
    })
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', { identifier: 'admin' }, {})
  }
}
