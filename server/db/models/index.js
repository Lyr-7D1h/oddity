'use strict'
const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

module.exports = fp((fastify, _, done) => {
  const basename = path.basename(__filename)
  const models = {}

  fs.readdir(__dirname, (err, files) => {
    if (err) {
      fastify.log.fatal('Could not load tables')
      throw err
    }

    const syncModelsPromises = []

    files
      .filter(
        // FILTER: Only js files and not this file
        file =>
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
      )
      .forEach(file => {
        const model = fastify.db['import'](path.join(__dirname, file))
        models[model.name] = model

        syncModelsPromises.push(model.sync())
      })

    Promise.all(syncModelsPromises)
      .then(() => {
        // Setup associations
        Object.keys(models).forEach(modelName => {
          // models[modelName].sync()
          if (models[modelName].associate) {
            models[modelName].associate(models)
          }
        })

        fastify.decorate('models', models)
        done()
      })
      .catch(err => {
        fastify.log.error(err)
      })
  })
})
