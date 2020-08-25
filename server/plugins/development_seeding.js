const fp = require('fastify-plugin')

const seed = async (models, crypto) => {
  const role = await models.role.create({
    name: 'Test',
    permissions: 1,
  })
  const passwordHash = await crypto.hash('test')
  await models.user.create({
    username: 'test',
    identifier: 'test',
    email: 'test@test.com',
    roleId: role.id,
    password: passwordHash,
    permissions: 0,
    ip: '127.0.0.1',
  })
}

module.exports = fp(
  async (instance) => {
    try {
      if (instance.config.NODE_ENV === 'development') {
        const count = await instance.models.oddityMeta.count()

        if (count === 0) {
          // default meta object
          await instance.models.oddityMeta.create({
            devShouldSeed: false,
          })
        } else {
          await seed(instance.models, instance.crypto)

          await instance.models.oddityMeta.update(
            {
              devShouldSeed: true,
            },
            { where: { id: 1 } }
          )
        }
      }
    } catch (err) {
      instance.log.error('Could not seed development tables')
      instance.log.error(err)
      instance.sentry.captureException(err)
    }
  },
  { name: 'development_seeding', dependencies: ['models'] }
)
