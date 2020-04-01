'use strict'

module.exports = async fastify => {
  fastify.get('/modules', function(request, reply) {
    fastify.models.module
      .findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      .then(modules => {
        return reply.send(modules)
      })
      .catch(err => {
        fastify.log.error(err)
        return reply.internalServerError()
      })
  })

  fastify.patch(
    '/modules/:id/route',
    {
      schema: {
        params: 'id#',
        body: {
          type: 'object',
          properties: {
            route: {
              type: 'string'
            }
          },
          required: ['route']
        }
      },
      permissions: fastify.PERMISSIONS.ADMIN,
      preHandler: [fastify.auth([fastify.authentication.cookie])]
    },
    (request, reply) => {
      if (!request.body) return reply.badRequest()

      fastify.models.module
        .update(
          { route: request.body.route },
          { where: { id: request.params.id }, returning: true }
        )
        .then(([amountModified, mod]) => {
          if (amountModified === 0) {
            return reply.noChange()
          } else {
            return reply.send(mod)
          }
        })
    }
  )

  fastify.patch(
    '/modules/:id/enabled',
    {
      schema: { params: 'id#' }
      // preHandler: [fastify.auth([fastify.authentication.cookie])]
    },
    (request, reply) => {
      if (!request.body) return reply.badRequest()

      fastify.models.module
        .update(
          { enabled: request.body.enabled },
          { where: { id: request.params.id }, returning: true }
        )
        .then(([amountModified, mod]) => {
          if (amountModified === 0) {
            reply.noChange()
          } else {
            reply.send(mod)
          }
        })
    }
  )
}
