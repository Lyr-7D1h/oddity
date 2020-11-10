module.exports = async (fastify) => {
  // Get Default Config (NOT USED)
  fastify.get(
    '/config',
    { permissions: fastify.PERMISSIONS.PUBLIC },
    (request, reply) => {
      fastify.models.config
        .findOne({ where: { isActive: true } })
        .then((config) => {
          reply.send(config)
        })
        .catch((err) => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.internalServerError()
        })
    }
  )

  fastify.patch(
    '/config/title',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
          },
          required: ['title'],
        },
      },
      preHandler: [fastify.auth([fastify.authorization.cookie])],
      permissions: [fastify.PERMISSIONS.ADMIN],
    },
    (request, reply) => {
      fastify.models.config
        .update(
          {
            title: request.body.title,
          },
          { where: { isActive: true }, returning: true }
        )
        .then((result) => reply.send(result[1][0]))
        .catch((err) => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.internalServerError()
        })
    }
  )
}
