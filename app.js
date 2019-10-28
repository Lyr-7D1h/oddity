'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

const envSchema = {
  type: 'object',
  required: ['CONNECTION_STRING', 'PORT', 'ADMIN_SECRET'],
  properties: {
    CONNECTION_STRING: { type: 'string' },
    ADMIN_SECRET: { type: 'string' },
    PORT: { type: 'integer' }
  },
  additionalProperties: false
}

module.exports = async (fastify, opts) => {
  fastify
    .register(require('fastify-env'), { schema: envSchema, data: [opts] })
    .register(require('fastify-sensible'))

    .register(require('fastify-cookie'))
    .register(require('fastify-session'), { secret: 'a secret with minimum length of 32 characters' })

    .register(require("fastify-auth"))

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
