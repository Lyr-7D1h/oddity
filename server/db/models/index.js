'use strict'
const fs = require('fs')
const path = require('path')

module.exports = (sequelize) => {
  const basename = path.basename(__filename)

  return new Promise((resolve, reject) => {
    fs.readdir(__dirname, (err, files) => {
      if (err) {
        reject(err)
      }

      const models = {}
      const syncModelsPromises = []

      files
        .filter(
          // FILTER: Only js files and not this file
          (file) => file !== basename && file.slice(-3) === '.js'
        )
        .forEach((file) => {
          const model = sequelize.import(path.join(__dirname, file))
          models[model.name] = model
          syncModelsPromises.push(model.sync())
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
