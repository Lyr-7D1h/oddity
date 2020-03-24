const { modules } = require('../module_loader_imports')
const fp = require('fastify-plugin')

module.exports = fp(
  (fastify, _, done) => {
    /**
     * TODO: use models instead of raw queries
     */
    const upsertModules = () => {
      const mods = modules.map(mod => ({
        name: mod.name,
        version: mod.version,
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      return new Promise((resolve, reject) => {
        fastify.db
          .query('SELECT * FROM "modules" WHERE name IN (?)', {
            replacements: [mods.map(mod => mod.name)]
          })
          .then(([existingModules]) => {
            const promises = []

            if (existingModules)
              for (const i in existingModules) {
                const mod = existingModules[i]
                promises.push(
                  fastify.db.queryInterface.bulkUpdate('modules', mod, {
                    name: mod.name
                  })
                )
              }

            const modsLeft = mods.filter(exisingMod => {
              return !existingModules.find(mod => {
                return mod.name === exisingMod.name
              })
            })

            if (modsLeft.length > 0) {
              promises.push(
                fastify.db.queryInterface.bulkInsert('modules', modsLeft, {
                  ignoreDuplicates: true
                })
              )
            }
            // Return needed to fix (node:6106) Warning: a promise was created in a handler at domain.js:137:15 but was not returned from it
            return Promise.all(promises)
              .then(() => resolve())
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      })
    }
    const removeUnusedModules = () => {
      return new Promise((resolve, reject) => {
        fastify.db
          .query('SELECT id, name FROM modules WHERE NOT name IN (?)', {
            replacements: [modules.map(mod => mod.name)]
          })
          .then(([mods]) => {
            if (mods.length) {
              fastify.log.debug(
                `Removing old modules "${mods.map(mod => mod.name).join(',')}"`
              )

              const ids = mods.map(mod => mod.id)

              fastify.db
                .query('DELETE FROM routes WHERE "moduleId" IN (?)', {
                  replacements: [ids]
                })
                .then(() => {
                  fastify.db
                    .query('DELETE FROM modules WHERE "id" IN (?)', {
                      replacements: [ids]
                    })
                    .then(() => {
                      resolve()
                    })
                    .catch(err => reject(err))
                })
                .catch(err => reject(err))
            } else {
              resolve()
            }
          })
          .catch(err => reject(err))
      })
    }
    upsertModules()
      .then(() => {
        removeUnusedModules()
          .then(() => {
            done()
          })
          .catch(err => done(err))
      })
      .catch(err => done(err))
  },
  {
    name: 'modules_sync',
    decorators: ['models'],
    dependencies: ['sequelize', 'models']
  }
)
