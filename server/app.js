'use strict'

const path = require('path')
const fastifyAutoload = require('fastify-autoload')

module.exports = async (fastify, opts) => {
  fastify
    .register(require('fastify-sensible'))

    .register(require('fastify-cookie'))
    .register(require('fastify-session'), {
      secret:
        fastify.config.SESSION_SECRET ||
        '&K$RePnO0NF#Z5sYSAGXaM!ezxd^E^PORi38u',
      cookie: {
        httpOnly: !(fastify.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
        secure: !(fastify.config.NODE_ENV === 'development')
      }
    })

    .register(require('fastify-cors'), {
      origin: 'http://localhost:3000'
    })

    .register(require('fastify-auth'))

    // Autoload Plugins
    .register(fastifyAutoload, {
      dir: path.join(__dirname, 'plugins'),
      options: Object.assign({}, opts)
    })
    // Autoload Routes
    .register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes'),
      options: Object.assign(
        {
          prefix: '/api'
        },
        opts
      )
    })

  if (fastify.config.NODE_ENV === 'development') {
    // if development proxy requests to dev react server
    fastify.register(require('fastify-http-proxy'), {
      upstream: 'http://localhost:3000',
      prefix: '/',
      http2: false
    })
  } else {
    // use react build
    fastify.register(require('fastify-static'), {
      root: path.join(__dirname, '../client/build'),
      prefix: '/'
    })
  }

  fastify.after(() => {
    fastify.log.info('Loading Default Config..')
    fastify.register(require('./default_config'))
  })
}
