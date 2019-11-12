'use strict'

// Read the .env file.
require('dotenv').config()

// installs an 'unhandledRejection' handler
require('make-promises-safe')

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    prettyPrint: true
  },
  dotenv: true
})

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

server.register(require('fastify-env'), { schema: envSchema })

server.register(require('./app.js'))

server.listen(process.env.PORT || 5000, err => {
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
