'use strict'

var Client = require('pg-native')
const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
} = require('./config.helper').data

const clear = () => {
  const client = new Client()

  client.connectSync(
    `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
  )

  // clear all tables
  client.querySync('DROP SCHEMA IF EXISTS public CASCADE;')
  client.querySync('CREATE SCHEMA public;')

  require('child_process').execSync(
    `DB_HOST=${DB_HOST} DB_NAME=${DB_NAME} DB_USERNAME=${DB_USERNAME} DB_PASSWORD=${DB_PASSWORD} node models_sync`,
    {
      cwd: require('path').join(__dirname, '..'),
    }
  )
}

module.exports = {
  clear,
}

/// TODO: use pg lib instead of pg-native: currently makes tests hang
// var { Client } = require('pg')
// const {
//   DB_HOST,
//   DB_NAME,
//   DB_USERNAME,
//   DB_PASSWORD,
// } = require('./config.helper')()

// const clear = () => {
//   const client = new Client({
//     user: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_NAME,
//     host: DB_HOST,
//   })
//   return Promise.all([
//     client.connect(),

//     client.query('DROP SCHEMA IF EXISTS public CASCADE;'),
//     client.query('CREATE SCHEMA public;'),

//     require('child_process').exec(
//       `DB_HOST=${DB_HOST} DB_NAME=${DB_NAME} DB_USERNAME=${DB_USERNAME} DB_PASSWORD=${DB_PASSWORD} node models_sync`,
//       {
//         cwd: require('path').join(__dirname, '..'),
//       }
//     ),
//   ])
// }

// module.exports = {
//   clear,
// }
