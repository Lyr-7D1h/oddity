'use strict'

module.exports = async (fastify, opts) => {
  fastify.baseRoute(fastify, opts, {
    Model: fastify.Role
    // excludeMethods: ['get', 'update', 'delete']
  })
}
