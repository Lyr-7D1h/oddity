module.exports = fastify => {
  fastify.get('/auth/logout', (request, reply) => {
    request.destroySession(err => {
      if (err) {
        fastify.log.error(err)
        reply.send(fastify.httpErrors.internalServerError())
      }
      reply.clearCookie('user', { path: '/' })
      reply.success()
    })
  })
}
