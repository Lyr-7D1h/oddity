'use strict'

var Client = require('pg-native')
const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD
} = require('./config.helper')()

module.exports = () => {
  const client = new Client()

  client.connectSync(
    `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
  )

  // clear all tables
  client.querySync('DROP SCHEMA IF EXISTS public CASCADE;')
  client.querySync('CREATE SCHEMA public;')

  const out = require('child_process').execSync(
    `DB_HOST=${DB_HOST} DB_NAME=${DB_NAME} DB_USERNAME=${DB_USERNAME} DB_PASSWORD=${DB_PASSWORD} node models_sync`,
    {
      cwd: require('path').join(__dirname, '..')
    }
  )
  console.log(out)
}
