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
        const oddityMeta = await instance.models.oddityMeta.findByPk(1)
        if (oddityMeta === 0) {
          // default meta object
          await instance.models.oddityMeta.create({
            devShouldSeed: false,
          })
          await seed(instance.models, instance.crypto)
        } else if (oddityMeta.devShouldSeed) {
          oddityMeta.devShouldSeed = false
          await oddityMeta.save()
          await seed(instance.models, instance.crypto)
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
