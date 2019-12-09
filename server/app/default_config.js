const fp = require('fastify-plugin')

const createAdminUser = instance => {
  return new Promise((resolve, reject) => {
    instance.Role.findOne({ name: 'Admin' }, '_id').then(role => {
      if (role === null) {
        reject(
          new Error(
            'Default Admin Role does not exist \nNot creating Admin User'
          )
        )
      } else {
        instance.User.findOne({ identifier: 'admin' }).then(adminUser => {
          if (adminUser === null) {
            instance.crypto
              .encryptKey('admin')
              .then(hash => {
                instance.User.create({
                  username: 'Admin',
                  identifier: 'admin',
                  password: hash,
                  email: 'admin@admin.com',
                  ip: '0:0:0:0',
                  roleId: role._id
                })
                  .then(() => {
                    resolve(true)
                  })
                  .catch(err => reject(err))
              })
              .catch(err => reject(err))
          } else {
            resolve()
          }
        })
      }
    })
  })
}

const createAdminRole = instance => {
  return new Promise((resolve, reject) => {
    instance.Role.findOne({ name: 'Admin' }).then(role => {
      if (role === null) {
        instance.Role.create({
          name: 'Admin',
          permissions: 1
        })
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        resolve()
      }
    })
  })
}

const createUserRole = instance => {
  return new Promise((resolve, reject) => {
    instance.Role.findOne({ name: 'User' }).then(role => {
      if (role === null) {
        instance.Role.create({
          name: 'User',
          isDefault: true,
          permissions: 0
        })
          .then(() => resolve(true))
          .catch(err => reject(err))
      } else {
        resolve()
      }
    })
  })
}

const createDefaultConfig = instance => {
  return new Promise((resolve, reject) => {
    instance.Config.find({}).then(configs => {
      if (configs.length === 0) {
        instance.Config.create({
          name: 'default',
          isActive: true,
          title: 'Oddity',
          routes: [
            { name: 'Home', path: '', module: 'home', default: true },
            { name: 'Forum', path: 'forum', module: 'forum' },
            { name: 'Members', path: 'members', module: 'members' },
            { name: 'Servers', path: 'servers', module: 'servers' }
          ]
        })
          .then(() => resolve(true))
          .catch(err => {
            reject(err)
          })
      } else {
        resolve()
      }
    })
  })
}

const createAdminPortal = instance => {
  return new Promise((resolve, reject) => {
    const secret = instance.config.ADMIN_SECRET || 'exsiteisverycool'

    instance.Portal.find({ name: 'admin' }, 'secretKey _id')
      .then(portals => {
        // create if does not exist
        if (portals.length === 0) {
          instance.crypto.encryptKey(secret).then(hash => {
            instance.Portal.create({
              name: 'admin',
              accessKey: instance.crypto.createKey(10),
              secretKey: hash
            })
              .then(() => {
                resolve(true)
              })
              .catch(err => {
                reject(err)
              })
          })
        } else {
          // update if it does exist
          instance.crypto
            .validateKey(secret, portals[0].secretKey)
            .then(isValid => {
              // if pass is not secret make it secret
              if (!isValid) {
                instance.crypto.encryptKey(secret).then(hash => {
                  instance.Portal.updateOne(
                    { _id: portals[0]._id },
                    { secretKey: hash }
                  )
                    .then(response => {
                      if (response.nModified !== 0) {
                        resolve(true)
                      }
                    })
                    .catch(err => {
                      reject(err)
                    })
                })
              } else {
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = fp(async instance => {
  const errHandler = err => {
    instance.log.fatal(err)
    process.exit(1)
  }

  createAdminPortal(instance)
    .then(created => {
      if (created) instance.log.info('Admin Portal Updated/Created')
    })
    .catch(errHandler)

  createDefaultConfig(instance)
    .then(created => {
      if (created) instance.log.info('Created Default Config')
    })
    .catch(errHandler)

  createUserRole(instance)
    .then(created => {
      if (created) instance.log.info('Created Default User Role')
    })
    .catch(errHandler)

  createAdminRole(instance)
    .then(created => {
      if (created) instance.log.info('Created Default Admin Role')

      createAdminUser(instance)
        .then(created => {
          if (created) instance.log.info('Created Default Admin User')
        })
        .catch(errHandler)
    })
    .catch(errHandler)

  instance.Portal.find({ name: 'admin' }, 'accessKey').then(portals => {
    if (portals[0]) {
      instance.log.info(`Admin Portal AccessKey: ${portals[0].accessKey}`)
    }
  })
})
