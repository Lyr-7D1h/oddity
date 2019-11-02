'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async (fastify, opts) => {
  fastify
    .register(require('fastify-sensible'))

    .register(require('fastify-cookie'))
    .register(require('fastify-session'), {
      secret:
        fastify.config.SESSION_SECRET ||
        '&K$RePnO0NF#Z5sYSAGXaM!ezxd^E^PORi38u',
      cookie: {
        httpOnly: !(fastify.config.ENV === 'development'), // set httpOnly and secure off when in dev
        secure: !(fastify.config.ENV === 'development')
      }
    })

    .register(require('fastify-auth'))

    // Autoload Plugins & Routes
    .register(AutoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: Object.assign({}, opts)
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: Object.assign({}, opts)
    })
}
