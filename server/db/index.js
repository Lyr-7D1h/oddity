const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

const MODELS_PATH = path.join(__dirname, 'models')

module.exports = fp((fastify, opts, done) => {
  const decorateModels = files => {
    // filter out index.js (needed for sequelize-cli) for models folder
    files = files.filter(file => file !== 'index.js')

    const modelsAsyncArray = files.map(file => {
      return require(path.join(MODELS_PATH, file))(fastify)
    })

    Promise.all(modelsAsyncArray)
      .then(modelsArray => {
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
      .catch(err => fastify.log.error(err))
  }

  fs.readdir(MODELS_PATH, (err, files) => {
    if (err) {
      fastify.log.fatal('Could not load tables')
      throw err
    }
    decorateModels(files)
  })
})
