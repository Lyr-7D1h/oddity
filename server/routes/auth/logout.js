module.exports = fastify => {
  fastify.get(
    '/auth/logout',
    {
      schema: {
        hide: true // hide from docs
      }
    },
    (request, reply) => {
      request.destroySession(err => {
        if (err) {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.send(fastify.httpErrors.internalServerError())
        }
        reply.clearCookie('user', { path: '/' })
        reply.success()
      })
    }
  )
}
