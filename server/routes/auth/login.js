module.exports = async fastify => {
  fastify.get(
    '/auth/login',
    {
      schema: {
        hide: true // hide from docs
      },
      preHandler: fastify.auth([fastify.authentication.basic])
    },
    (request, reply) => {
      console.log(reply.user.id)
      fastify
        .setUserCookie(reply, reply.user.id)
        .then(() => {
          request.session.user = { id: reply.user.id }
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
