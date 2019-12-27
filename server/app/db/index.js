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

      fastify.log.info('[DB] Setting up associations')

      models.forumThread.belongsTo(models.forumCategory)
      models.forumCategory.hasMany(models.forumThread)

      // Sync all models
      Promise.all(syncModels)
        .then(() => {
          fastify.log.info('[DB] Synchronized models')
          done()
        })
        .catch(err => fastify.log.error(err))

      fastify.decorate('models', models)
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
