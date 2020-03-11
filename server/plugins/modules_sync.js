const { modules } = require('../module_loader_imports')
const fp = require('fastify-plugin')

module.exports = fp(
  async fastify => {
    console.log(modules)
    const upsertModules = () => {
      const mods = modules.map(mod => ({
        name: mod.name,
        version: mod.version
      }))
      console.log(mods)
      return fastify.db.queryInterface.upsert('modules', mods)
    }
    const removeUnusedModules = () => {
      return new Promise((resolve, reject) => {
        fastify.db
          .query('SELECT id, name FROM modules WHERE NOT name IN (?)', {
            replacements: [modules.map(mod => mod.name)]
          })
          .then(([mods]) => {
            if (mods.length) {
              fastify.log.debug(`Removing old modules "${mods.join(',')}"`)

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
    dependencies: ['sequelize']
  }
)
