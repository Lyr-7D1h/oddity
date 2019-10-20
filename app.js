'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

const envSchema = {
  type: 'object',
  required: ['CONNECTION_STRING', 'PORT'],
  properties: {
    CONNECTION_STRING: { type: 'string' },
    PORT: { type: 'integer' }
  },
  additionalProperties: false
}

module.exports = async (fastify, opts) => {
  fastify
    .register(require('fastify-env'), { schema: envSchema, data: [opts] })
    .register(require('fastify-sensible'))

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
