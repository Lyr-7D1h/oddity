'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const db = {}

const HOST = process.env.DB_HOST || 'localhost'
const DATABASE = process.env.DB_NAME || 'oddity'
const USERNAME = process.env.DB_USERNAME || 'oddity'
const PASSWORD = process.env.DB_PASSWORD

const sequelizeOpts = {
  host: HOST,
  dialect: 'postgres'
}

if (
  process.env.DB_LOGGING_ENABLED === false ||
  process.env.DB_LOGGING_ENABLED === undefined
) {
  sequelizeOpts.logging = false
}

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, sequelizeOpts)

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
