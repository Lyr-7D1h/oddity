'use strict'

module.exports = async (fastify, opts) => {
  fastify.get(
    '/',
    {
      permissions: fastify.PERMISSIONS.NON_SET,
    },
    async (request, reply) => {
      return 'Welcome to Oddity API'
    }
  )
  fastify.all(
    '/*',
    {
      permissions: fastify.PERMISSIONS.NON_SET,
    },
    (request, reply) => {
      reply.notFound()
    }
  )
}
