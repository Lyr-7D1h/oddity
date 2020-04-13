'use strict'

module.exports = async (fastify) => {
  fastify.post(
    '/users/preflight',
    {
      permissions: fastify.PERMISSIONS.NON_SET,
    },
    (request, reply) => {
      const search = {}

      if (request.body.username) search.username = request.body.username
      if (request.body.email) search.email = request.body.email
      if (request.body.identifier) search.identifier = request.body.identifier

      if (Object.keys(search).length === 0) {
        return reply.badRequest('No username, email or identifier given')
      }

      fastify.models.user
        .findOne({
          where: search,
          attributes: {
            include: ['id'],
          },
        })
        .then((user) => {
          console.log(user)
          if (user) {
            return reply.send(true)
          } else {
            return reply.send(false)
          }
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.internalServerError(err)
        })
    }
  )
}
