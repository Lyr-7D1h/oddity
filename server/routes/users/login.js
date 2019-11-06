module.exports = fastify => {
  fastify.get(
    '/users/login',
    {
      preHandler: fastify.auth([
        fastify.verify.basic.portal,
        fastify.verify.basic.user
      ])
    },
    (request, reply) => {
      request.session.user = request.credentials
      reply.send()
    }
  )
}
