const { modules } = require('../module_loader_imports')
const fp = require('fastify-plugin')

module.exports = fp(
  async fastify => {
    const upsertModules = () => {
      const mods = modules.map(mod => ({
        name: mod.name,
        version: mod.version,
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
              promises.push(
                fastify.db.queryInterface.bulkInsert(
                  'modules',
                  existingModules,
                  {
                    updateOnDuplicate: ['name', 'version', 'updatedAt'],
                    upsertKeys: ['name']
                  }
                )
              )

            const modsLeft = mods.filter(
              exisingMod => -1 !== existingModules.indexOf(exisingMod.name)
            )

            if (modsLeft.length > 0)
              promises.push(
                fastify.db.queryInterface.bulkInsert('modules', modsLeft)
              )
            Promise.all(promises)
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
    try {
      await upsertModules()
      await removeUnusedModules()
    } catch (err) {
      fastify.log.error(err)
    }
  },
  {
    name: 'modules_sync',
    decorators: ['models'],
    dependencies: ['sequelize']
  }
)
