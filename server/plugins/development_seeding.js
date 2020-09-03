const fp = require('fastify-plugin')
const { exec } = require('child_process')

const development_seed = async (models, crypto) => {
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

const seed = () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:seed:all', (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

module.exports = fp(
  async (instance) => {
    try {
      if (instance.config.NODE_ENV === 'development') {
        const oddityMeta = await instance.models.oddityMeta.findByPk(1)

        if (!oddityMeta) {
          await instance.models.oddityMeta.create({
            devShouldSeed: false,
            shouldSeed: false,
          })
          instance.log.debug('First time connecting to db seeding...')
          await seed()
          await development_seed(instance.models, instance.crypto)
        } else {
          if (oddityMeta.shouldSeed) {
            oddityMeta.shouldSeed = false
            await oddityMeta.save()
            instance.log.debug('Seeding data...')
            await seed()
          } else if (oddityMeta.devShouldSeed) {
            oddityMeta.devShouldSeed = false
            await oddityMeta.save()
            instance.log.debug('Seeding development data...')
            await development_seed(instance.models, instance.crypto)
          }
        }
      }
    } catch (err) {
      instance.log.error('Could not seed development tables')
      instance.log.error(err)
      instance.sentry.captureException(err)
    }
  },
  { name: 'seeding', dependencies: ['models'] }
)
