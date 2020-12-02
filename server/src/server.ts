'use strict'

import Sentry = require('@sentry/node')
import Fastify from 'fastify'
import child_process from 'child_process'
import fastifyEnv from 'fastify-env'
import app from './app'
import pino from 'pino'
import perf_hooks from 'perf_hooks'

// installs an 'unhandledRejection' handler
import 'make-promises-safe'

// sentry.io
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment:
    process.env.NODE_ENV === 'development' ? 'development' : 'production',
})

// Instantiate Fastify with some config
const server = Fastify({
  logger: pino({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
  }),
})

const envSchema = {
  type: 'object',
  required: [
    'SESSION_SECRET',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'CAPTCHA_CLIENT',
    'CAPTCHA_SERVER',
  ],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_LOGGING_ENABLED: { type: 'boolean' },
    SESSION_SECRET: { type: 'string' },
    PORT: { type: 'integer' },
    NODE_ENV: { type: 'string' },
    CAPTCHA_CLIENT: { type: 'string' },
    CAPTCHA_SERVER: { type: 'string' },
    SHOW_ROUTES: { type: 'boolean' },
  },
  additionalProperties: false,
}

declare module 'fastify' {
  interface FastifyInstance {
    sentry: Sentry.NodeClient
    config: {
      DB_HOST: string
      DB_NAME: string
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_LOGGING_ENABLED: boolean
      SESSION_SECRET: string
      PORT?: number
      NODE_ENV?: string
      CAPTCHA_CLIENT: string
      CAPTCHER_SERVER: string
      SHOW_ROUTES?: boolean
    }
  }
}

server.decorate('sentry', Sentry)

server.register(fastifyEnv, { schema: envSchema, dotenv: true }).register(app)

// If in development run module_loader on start as a child process
if (process.env.NODE_ENV === 'development')
  child_process.exec('node ../module_loader', (err, stdout) => {
    if (err) {
      server.log.fatal('Something went wrong with the module loader')
      server.log.error(err)
      process.exit(1)
    }
    server.log.debug('\n' + stdout)
  })

server.listen(process.env.PORT || 5000, '0.0.0.0', (err) => {
  if (err) {
    server.log.error(err)
    server.sentry.captureException(err)
    process.exit(1)
  }

  if (server.config.NODE_ENV === 'development') {
    server.log.info('Running in development mode')
    if (server.config.SHOW_ROUTES !== false) {
      server.log.debug('Routes:')
      console.debug(server.printRoutes())
    }
    server.log.info('Startup time is ' + perf_hooks.performance.now() + 'ms')
  }

  // server.log.info(`Listening on http://0.0.0.0:${process.env.PORT || 5000}`)
})
