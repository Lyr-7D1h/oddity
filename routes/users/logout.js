const { InternalServerError } = require('http-errors')

module.exports = fastify => {
  fastify.get(
    '/users/logout',
    {
      preHandler: fastify.auth([fastify.verify.cookie])
    },
    (request, reply) => {
      request.destroySession(err => {
        if (err) {
          fastify.log.error(err)
          reply.send(new InternalServerError())
        }
        reply.send()
      })
    }
  )
}
