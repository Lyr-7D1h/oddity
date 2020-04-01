module.exports = async fastify => {
  fastify.get(
    '/auth/login',
    {
      schema: {
        hide: true // hide from docs
      },
      preHandler: fastify.auth([fastify.authentication.basic]),
      permissions: fastify.PERMISSIONS.NONE
    },
    (request, reply) => {
      fastify
        .setUserCookie(reply, request.user.id)
        .then(() => {
          request.session.user = { id: request.user.id }
          reply.send()
        })
        .catch(err => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.send(fastify.httpErrors.internalServerError())
        })
    }
  )
}
