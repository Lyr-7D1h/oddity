const fp = require('fastify-plugin')
const moduleLoaderImports = require('../module_loader_imports')
const fs = require('fs')
const path = require('path')
const util = require('util')

const readdir = util.promisify(fs.readdir)

// Sequentially migrate all files with a timestamp later than oddityMeta.latestMigration
const migrate = async (instance) => {
  const migrationsPath = path.join(__dirname, '../db/migrations')

  const filenames = await readdir(migrationsPath)

  // Get all migrations and retrieve/validate timestamp
  const migrations = filenames
    .map((filename) => path.join(migrationsPath, filename))
    .concat(moduleLoaderImports.migrations)
    .map((p) => {
      if (p.slice(-3) !== '.js') {
        instance.log.error(`Migrations: ${p} is not a javascript file`)
      }
      let timestamp = path.parse(p).base.match(/^[0-9]{12,15}/)

      if (!timestamp || timestamp.length !== 1)
        instance.log.warn(`Migrations: invalid timestamp for ${p}`)
      timestamp = timestamp[0]

      return { path: p, timestamp: parseInt(timestamp) }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

  const oddityMeta = await instance.models.oddityMeta.findByPk(1)

  let newTimeStamp
  let count = 0
  for (migration of migrations) {
    if (migration.timestamp > oddityMeta.latestMigration) {
      await require(migration.path).up(
        instance.db.getQueryInterface(),
        instance.Sequelize
      )
      newTimeStamp = migration.timestamp
      count++
    }
  }

  if (newTimeStamp) {
    instance.log.info(`Migrations: ${count} new migrations ran.`)
    await oddityMeta.update({ latestMigration: newTimeStamp })
  }
}

module.exports = fp(
  (instance, _opts, next) => {
    if (instance.config.NODE_ENV !== 'development') {
      migrate(instance)
        .then(() => next())
        .catch((err) => {
          instance.error(err)
          next()
        })
    } else {
      next()
    }
  },
  {
    name: 'migrations',
    dependencies: ['sequelize'],
  }
)
