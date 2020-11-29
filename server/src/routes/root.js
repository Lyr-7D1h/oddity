'use strict'

module.exports = async (fastify, opts) => {
  fastify.get(
    '/',
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    async (request, reply) => {
      return 'Welcome to Oddity API'
    }
  )
  fastify.all(
    '/*',
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      reply.notFound()
    }
  )
}
