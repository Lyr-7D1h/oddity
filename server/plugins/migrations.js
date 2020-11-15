const fp = require('fastify-plugin')
const moduleLoaderImports = require('../module_loader_imports')
const fs = require('fs')
const path = require('path')

module.exports = fp(
  (instance, _opts, next) => {
    const migrationsPath = path.join(__dirname, '../db/migrations')
    fs.readdir(migrationsPath, (err, filenames) => {
      if (err) throw err

      const migrations = filenames
        .map((filename) => path.join(migrationsPath, filename))
        .concat(moduleLoaderImports.migrations)
        .map((p) => {
          let timestamp = path.parse(p).base.match(/^[0-9]{12,15}/)

          if (!timestamp || timestamp.length !== 1)
            instance.log.warn(`Migrations: invalid timestamp for ${p}`)
          timestamp = timestamp[0]

          return { path: p, timestamp: parseInt(timestamp) }
        })
        .sort((a, b) => a.timestamp - b.timestamp)

      instance.models.oddityMeta
        .findByPk(1)
        .then((oddityMeta) => {
          let newTimeStamp
          const migrationPromises = []
          migrations.forEach((migration) => {
            if (migration.timestamp > oddityMeta.latestMigration) {
              migrationPromises.push(
                require(migration.path).up(
                  instance.db.getQueryInterface(),
                  instance.Sequelize
                )
              )
              newTimeStamp = migration.timestamp
            }
          })

          if (newTimeStamp) {
            instance.log.info(
              `Migrations: ${migrationPromises.length} new migrations found. Migrating...`
            )
            Promise.all(migrationPromises)
              .then(() => {
                oddityMeta
                  .update({ latestMigration: newTimeStamp })
                  .then(() => next())
                  .catch((err) => {
                    instance.error(err)
                    next()
                  })
              })
              .catch((err) => {
                instance.error(err)
                next()
              })
          } else {
            next()
          }
        })
        .catch((err) => {
          instance.error(err)
          next()
        })
    })
  },
  { name: 'migrations', dependencies: ['sequelize'] }
)
