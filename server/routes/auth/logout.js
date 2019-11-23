module.exports = fastify => {
  fastify.get(
    '/auth/logout',
    {
      preHandler: fastify.auth([fastify.verify.cookie])
    },
    (request, reply) => {
      request.destroySession(err => {
        if (err) {
          fastify.log.error(err)
          reply.send(fastify.httpErrors.internalServerError())
        }
        reply.clearCookie('user', { path: '/' })
        reply.send()
      })
    }
  )
}
