'use strict'

// This file contains code that we reuse
// between our tests.

const fp = require('fastify-plugin')
const Fastify = require('fastify')

// Fill in this config with all the configurations
// needed for testing the application
const config = () => {
  return {
    NODE_ENV: 'testing',
    CONNECTION_STRING:
      'mongodb+srv://oddityStaging:40vOCy06sago47Pk@staging-ausly.gcp.mongodb.net/testing?retryWrites=true&w=majority',
    SESSION_SECRET: 'this_is_a_very_big_string_which_is_longer_than_32',
    ADMIN_SECRET: 'secret',
    dotenv: true
  }
}

const envSchema = {
  type: 'object',
  required: ['CONNECTION_STRING', 'ADMIN_SECRET'],
  properties: {
    CONNECTION_STRING: { type: 'string' },
    ADMIN_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' }
  },
  additionalProperties: false
}

// automatically build and tear down our instance
const build = t => {
  const app = Fastify()

  // Set Fastify Env with env variables defined here
  app.register(require('fastify-env'), { schema: envSchema, data: config() })

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(require('../app')), { disableConfig: true })

  process.on('uncaughtException', err => t.error(err))

  // tear down our app after we are done
  t.tearDown(() => {
    // Overwrite exitCode to 0 when tearing down
    // Fastify always sets exitCode to 1 when closing
    process.on('exit', () => {
      process.exitCode = 0
    })

    app.close()
  })

  return app
}

module.exports = {
  config,
  build
}
