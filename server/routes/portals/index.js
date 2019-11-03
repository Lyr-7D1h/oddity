'use strict'

module.exports = async (fastify, opts) => {
  fastify.baseRoute(fastify, opts, {
    Model: fastify.Portal,
    columns: 'name url'
  })
}
