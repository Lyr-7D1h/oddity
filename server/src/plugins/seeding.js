const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')
const { seeders: importSeeders } = require('../../module_loader_imports')
const util = require('util')

const readdir = util.promisify(fs.readdir)

const development_seed = async (models, crypto) => {
  const role = await models.role.create({
    name: 'Test',
    permissions: 1,
  })
  const passwordHash = await crypto.hash('test')
  await models.user.create({
    username: 'Test',
    identifier: 'test',
    email: 'test@test.com',
    roleId: role.id,
    password: passwordHash,
    permissions: 0,
    ip: '127.0.0.1',
  })
}

// Sequentially seed all seeder files
const seed = async (instance) => {
  const seedersPath = path.join(__dirname, '../db/seeders')
  const matches = await readdir(seedersPath)

  const seeders = matches
    .map((match) => path.join(seedersPath, match))
    .concat(importSeeders)
    .map((p) => {
      if (p.slice(-3) !== '.js') {
        instance.log.error(`Seeding: ${p} is not a javascript file`)
      }

      let timestamp = path.parse(p).base.match(/^[0-9]{12,15}/)

      if (!timestamp || timestamp.length !== 1)
        instance.log.warn(`Seeding: invalid timestamp for ${p}`)
      timestamp = timestamp[0]

      return { path: p, timestamp: parseInt(timestamp) }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  for (const seeder of seeders) {
    await require(seeder.path).up(
      instance.db.getQueryInterface(),
      instance.Sequelize
    )
  }
}

module.exports = fp(
  async (instance) => {
    try {
      const oddityMeta = await instance.models.oddityMeta.findByPk(1)

      if (!oddityMeta) {
        instance.log.debug('Seeding: First time connecting to db')
        const devShouldSeed = instance.config.NODE_ENV !== 'development'
        await seed(instance)
        if (!devShouldSeed)
          await development_seed(instance.models, instance.crypto)
        await instance.models.oddityMeta.create({
          devShouldSeed,
          shouldSeed: false,
        })
      } else {
        if (
          instance.config.NODE_ENV === 'development' &&
          oddityMeta.devShouldSeed
        ) {
          instance.log.debug('Seeding: creating development data')
          await development_seed(instance.models, instance.crypto)
          oddityMeta.devShouldSeed = false
          await oddityMeta.save()
        }
        if (oddityMeta.shouldSeed) {
          instance.log.debug('Seeding: creating data')
          await seed(instance)
          oddityMeta.shouldSeed = false
          await oddityMeta.save()
        }
      }
    } catch (err) {
      instance.log.error('Seeding: Could not seed tables')
      instance.error(err)
    }
  },
  { name: 'seeding', dependencies: ['migrations'] }
)
