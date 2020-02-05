'use strict'

const fp = require('fastify-plugin')
const Fastify = require('fastify')

const envSchema = {
  type: 'object',
  required: [
    'ADMIN_SECRET',
    'SESSION_SECRET',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME'
  ],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_LOGGING_ENABLED: { type: 'boolean' },
    ADMIN_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' }
  },
  additionalProperties: false
}

// automatically build and tear down our instance
module.exports = t => {
  const app = Fastify()

  // Set Fastify Env with env variables defined here
  app.register(require('fastify-env'), {
    schema: envSchema,
    data: require('./config.helper')()
  })

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(require('../app')), { disableConfig: true })

  process.on('uncaughtException', err => () => {
    console.log('UNCAUGHT ERROR')
    t.error(err)
  })

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
