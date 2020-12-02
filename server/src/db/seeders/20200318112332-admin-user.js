'use strict'

const bcrypt = require('bcrypt')

const hash = bcrypt.hashSync('root', 12)

module.exports = {
  up: (queryInterface) => {
    return new Promise((resolve, reject) => {
      queryInterface.sequelize
        .query(`SELECT * FROM "roles" WHERE name='Admin'`)
        .then(([roles]) => {
          if (roles.length === 1) {
            return queryInterface
              .bulkInsert('users', [
                {
                  username: 'Root',
                  identifier: 'root',
                  password: hash,
                  email: 'root@root.com',
                  roleId: roles[0].id,
                  ip: '0:0:0:0',
                  permissions: 0x2,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ])
              .then(() => resolve())
              .catch((err) => reject(err))
          } else {
            reject(new Error('Could not find Admin Role'))
          }
        })
        .catch((err) => reject(err))
    })
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', { identifier: 'root' }, {})
  },
}
