const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

const TABLES_PATH = path.join(__dirname, 'tables')

module.exports = fp((fastify, opts, done) => {
  const decorateModels = files => {
    const modelsAsyncArray = files.map(file => {
      return require(path.join(TABLES_PATH, file))(fastify)
    })

    Promise.all(modelsAsyncArray).then(modelsArray => {
      let models = {}
      let syncModels = []

      modelsArray.forEach(model => {
        models[model.name] = model
        syncModels.push(model.sync())
      })

      // Sync all models
      Promise.all(syncModels)
        .then(() => {
          fastify.log.info('[DB] Synchronized models')
          require('./associations')(models)
          fastify.log.info('[DB] Associations setup')

          fastify.decorate('models', models)
          done()
        })
        .catch(err => fastify.log.error(err))
    })
  }

  fs.readdir(TABLES_PATH, (err, files) => {
    if (err) {
      fastify.log.fatal('Could not load tables')
      process.exit(1)
    }
    decorateModels(files)
  })
})
