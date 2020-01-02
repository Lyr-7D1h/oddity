const fp = require('fastify-plugin')

const createAdminUser = instance => {
  return new Promise((resolve, reject) => {
    instance.models.role.findOne({ where: { name: 'Admin' } }).then(role => {
      if (role === null) {
        reject(
          new Error(
            'Default Admin Role does not exist \nNot creating Admin User'
          )
        )
      } else {
        instance.crypto
          .hash('admin')
          .then(hash => {
            instance.models.user
              .findOrCreate({
                where: { identifier: 'admin' },
                defaults: {
                  username: 'Admin',
                  identifier: 'admin',
                  password: hash,
                  email: 'admin@admin.com',
                  ip: '0:0:0:0',
                  roleId: role.id
                }
              })
              .then(([user, created]) => resolve(created))
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      }
    })
  })
}

const createAdminRole = instance => {
  return new Promise((resolve, reject) => {
    instance.models.role.findOne({ name: 'Admin' }).then(role => {
      if (role === null) {
        instance.models.role
          .create({
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
    instance.models.role
      .findOrCreate({
        where: { name: 'User' },
        defaults: {
          name: 'User',
          isDefault: true,
          permissions: 0
        }
      })
      .then(([role, created]) => {
        resolve(created)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const createDefaultConfig = instance => {
  const createRoutes = configId => {
    const routes = [
      {
        name: 'Home',
        path: '',
        module: 'home',
        default: true,
        configId: configId
      },
      {
        name: 'Forum',
        path: 'forum',
        module: 'forum',
        default: false,
        configId: configId
      },
      {
        name: 'Members',
        path: 'members',
        module: 'members',
        default: false,

        configId: configId
      },
      {
        name: 'Servers',
        path: 'servers',
        module: 'servers',
        default: false,

        configId: configId
      }
    ]

    let routePromises = []
    routes.forEach(route => {
      routePromises.push(
        instance.models.route.findOrCreate({
          where: { name: route.name },
          defaults: route
        })
      )
    })

    return new Promise((resolve, reject) => {
      Promise.all(routePromises)
        .then(createdArray => {
          const created =
            createdArray.filter(created => created === true).length > 0
              ? true
              : false
          resolve(created)
        })
        .catch(err => reject(err))
    })
  }
  const createConfig = () => {
    return new Promise((resolve, reject) => {
      instance.models.config
        .findOrCreate({
          where: { name: 'default' },
          defaults: {
            name: 'default',
            isActive: true,
            title: 'Oddity'
          }
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
  return new Promise((resolve, reject) => {
    createConfig()
      .then(([config, created1]) => {
        createRoutes(config.id).then(created2 => resolve(created1 || created2))
      })
      .catch(err => reject(err))
  })
}

const createAdminPortal = instance => {
  return new Promise((resolve, reject) => {
    const secret = instance.config.ADMIN_SECRET || 'exsiteisverycool'

    instance.crypto
      .hash(secret)
      .then(hash => {
        instance.models.portal
          .upsert({
            name: 'admin',
            accessKey: instance.crypto.createKey(10),
            secretKey: hash
          })
          .then(created => {
            resolve(created)
          })
      })
      .catch(err => reject(err))
  })
}

const createDefaultForumCategory = instance => {
  return new Promise((resolve, reject) => {
    instance.models.forumCategory
      .findOrCreate({
        where: { title: 'Uncategorized' },
        defaults: {
          title: 'Uncategorized',
          order: 0
        }
      })
      .then(([forumCategory, created]) => resolve(created))
      .catch(err => reject(err))
  })
}

module.exports = fp(async instance => {
  instance.log.info('Loading Default Config..')
  const errHandler = err => {
    instance.log.fatal(err)
    process.exit(1)
  }

  createDefaultForumCategory(instance)
    .then(created => {
      if (created) instance.log.info('Created Uncategorized Forum Category')
    })
    .catch(errHandler)

  createAdminPortal(instance)
    .then(created => {
      if (created) instance.log.info('Admin Portal Updated/Created')
    })
    .catch(errHandler)
    .finally(() => {
      instance.models.portal
        .findOne({ where: { name: 'admin' } })
        .then(portal => {
          if (portal) {
            instance.log.info(`Admin Portal AccessKey: ${portal.accessKey}`)
          } else {
            instance.log.error('Could not find Admin Portal')
          }
        })
    })

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
})
