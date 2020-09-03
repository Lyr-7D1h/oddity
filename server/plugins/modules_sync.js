let { modules } = require('../module_loader_imports')
const fp = require('fastify-plugin')

modules = modules.map((mod) => ({
  identifier: mod.name.toLowerCase(),
  name: mod.name,
  version: mod.version,
  enabled: false,
  route: mod.name,
  title: mod.name,
}))

// Sync modules with db
module.exports = fp(
  async (fastify, _, done) => {
    const upsertModules = () => {
      return new Promise((resolve, reject) => {
        const promises = []

        fastify.db
          .query(
            'SELECT id, identifier, name FROM modules WHERE identifier IN (?)',
            {
              replacements: [modules.map((mod) => mod.identifier)],
            }
          )
          .then(([mods]) => {
            // Make sure existing modules settings isn't overwritten
            modules = modules.map((mod) => {
              if (
                -1 !==
                mods.findIndex(
                  (existingMod) => existingMod.identifier === mod.identifier
                )
              ) {
                return {
                  identifier: mod.identifier,
                  name: mod.name,
                  version: mod.version,
                }
              }
              return mod
            })

            modules.forEach((mod) => {
              promises.push(
                fastify.models.module.upsert(mod, {
                  where: { identifier: mod.identifier },
                  returning: true,
                })
              )
            })

            // Return needed to fix (node:6106) Warning: a promise was created in a handler at domain.js:137:15 but was not returned from it
            return Promise.all(promises)
              .then((rows) => {
                rows = rows
                  .filter((mod) => mod[1])
                  .map((mod) => mod[0].name)
                  .join(', ')

                if (rows)
                  fastify.log.debug(`Modules Sync: Created "${rows}" modules`)
                resolve()
              })
              .catch((err) => reject(err))
          })
          .catch((err) => reject(err))
      })
    }

    const removeUnusedModules = () => {
      return new Promise((resolve, reject) => {
        fastify.db
          .query(
            'SELECT id, identifier, name FROM modules WHERE NOT identifier IN (?)',
            {
              replacements: [modules.map((mod) => mod.identifier)],
            }
          )
          .then(([mods]) => {
            if (mods.length > 0) {
              fastify.log.debug(
                `Modules Sync: Removing old modules "${mods
                  .map((mod) => mod.name)
                  .join(',')}"`
              )

              const ids = mods.map((mod) => mod.id)

              return fastify.models.module
                .destroy({ where: { id: ids } })
                .then(() => resolve())
                .catch((err) => reject(err))
            } else {
              resolve()
            }
          })
          .catch((err) => reject(err))
      })
    }
    upsertModules()
      .then(() => {
        removeUnusedModules()
          .then(() => {
            done()
          })
          .catch((err) => done(err))
      })
      .catch((err) => done(err))
  },
  {
    name: 'modules_sync',
    // decorators: ['models'],
    dependencies: ['sequelize', 'seeding'],
  }
)
