'use strict'

// Read the .env file.
require('dotenv').config()

// installs an 'unhandledRejection' handler
require('make-promises-safe')

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const server = Fastify({
  // ignoreTrailingSlash: true,
  logger: {
    prettyPrint: true
  },
  dotenv: true
})

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

server.register(require('fastify-env'), { schema: envSchema })

server.register(require('./app'))

server.listen(process.env.PORT || 5000, '0.0.0.0', err => {
  if (server.config.NODE_ENV === 'development') {
    server.log.warn('RUNNING IN DEVELOPMENT MODE')
  }
  server.log.info('Routes:')
  console.debug(server.printRoutes())
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
