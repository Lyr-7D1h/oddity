'use strict'

const Sentry = require('@sentry/node')

// Read the .env file.
require('dotenv').config()

// sentry.io
Sentry.init({
  dsn: 'https://ac8fa8071ed5482c8d559a8acb51f8fc@sentry.io/1886726',
  environment:
    process.env.NODE_ENV === 'development' ? 'development' : 'production'
})

// installs an 'unhandledRejection' handler
require('make-promises-safe')

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const server = Fastify({
  // ignoreTrailingSlash: true,
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    prettyPrint: process.env.NODE_ENV === 'development'
  },
  dotenv: true
})

const envSchema = {
  type: 'object',
  required: ['SESSION_SECRET', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_LOGGING_ENABLED: { type: 'boolean' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' }
  },
  additionalProperties: false
}

server.decorate('sentry', Sentry)

server
  .register(require('fastify-env'), { schema: envSchema })
  .register(require('./app'))

// If in development run module_loader on start as a child process
if (process.env.NODE_ENV === 'development')
  require('child_process').exec('node module_loader', (err, stdout) => {
    if (err) {
      server.log.fatal('Something went wrong with the module loader')
      server.log.error(err)
      process.exit(1)
    }
    server.log.debug('\n', stdout)
  })

server.listen(process.env.PORT || 5000, '0.0.0.0', err => {
  if (server.config.NODE_ENV === 'development') {
    server.log.warn('RUNNING IN DEVELOPMENT MODE')
    server.log.info('Routes:')
    console.debug(server.printRoutes())
    server.log.info(
      'Startup time is ' + require('perf_hooks').performance.now() + 'ms'
    )
  }

  server.log.info(`Listening on http://0.0.0.0:${process.env.PORT || 5000}`)

  if (err) {
    server.log.fatal(err)
    server.sentry.captureException(err)
    throw err
  }
})
