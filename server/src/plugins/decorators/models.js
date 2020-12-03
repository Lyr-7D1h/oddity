'use strict'
const fp = require('fastify-plugin')
const path = require('path')
const fs = require('fs')
const { models: importModels } = require('../../../module_loader_imports')

const getModels = (instance) => {
  const modelsPath = path.join(__dirname, '../../db/models')
  return new Promise((resolve, reject) => {
    fs.readdir(modelsPath, (err, matches) => {
      if (err) reject(err)

      const syncModelsPromises = []
      const models = {}

      matches
        .map((filename) => path.join(modelsPath, filename))
        .concat(importModels)
        .forEach((modelPath) => {
          if (modelPath.slice(-3) !== '.js') {
            instance.log.error(`Models: ${modelPath} is not a javascript file`)
          }
          const model = require(modelPath)(instance.db, instance.Sequelize)
          syncModelsPromises.push(model.sync())
          models[model.name] = model
        })

      Promise.all(syncModelsPromises)
        .then(() => {
          // Setup associations
          Object.keys(models).forEach((modelName) => {
            // models[modelName].sync()
            if (models[modelName].associate) {
              models[modelName].associate(models)
            }
          })

          resolve(models)
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

module.exports = fp(
  (instance, _, next) => {
    getModels(instance)
      .then((models) => {
        instance.decorate('models', models)
        next()
      })
      .catch((err) => {
        instance.log.error(err)
      })
  },
  {
    name: 'models',
    decorators: {
      fastify: ['db'],
    },
    dependencies: ['sequelize'],
  }
)
