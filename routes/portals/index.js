'use strict'

module.exports = async (fastify, opts) => {
  console.log(fastify.config)
  fastify.baseRoute(fastify, opts, {
    Model: fastify.Portal,
    columns: 'name url'
  })
}
