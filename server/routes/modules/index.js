'use strict'

module.exports = async (fastify) => {
  fastify.get(
    '/modules',
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    function (_, reply) {
      fastify.models.module
        .findAll({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        })
        .then((modules) => {
          return reply.send(modules)
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.internalServerError()
        })
    }
  )

  fastify.get(
    '/modules/identifier/:identifier/enabled',
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
      schema: {
        params: {
          type: 'object',
          properties: {
            identifier: {
              type: 'string',
            },
          },
          required: ['identifier'],
        },
      },
    },
    (request, reply) => {
      fastify.models.module
        .findOne({
          where: { identifier: request.params.identifier, enabled: true },
        })
        .then((mod) => {
          return reply.send(mod)
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.internalServerError()
        })
    }
  )

  fastify.patch(
    '/modules/:id',
    {
      schema: {
        params: 'id#',
        body: {
          type: 'object',
        },
      },
      permissions: fastify.PERMISSIONS.ADMIN,
      preHandler: [fastify.auth([fastify.authorization.cookie])],
    },
    (request, reply) => {
      if (!request.body) return reply.badRequest()

      fastify.models.module
        .update(request.body, {
          where: { id: request.params.id },
          returning: true,
        })
        .then(([amountModified, mod]) => {
          if (amountModified === 0) {
            return reply.noChange()
          } else {
            return reply.send(mod[0])
          }
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.badRequest(err.message)
        })
    }
  )

  fastify.patch(
    '/modules/:id/enabled',
    {
      schema: { params: 'id#' },
      preHandler: [fastify.auth([fastify.authorization.cookie])],
      permissions: [
        fastify.PERMISSIONS.ADMIN,
        fastify.PERMISSIONS.MANAGE_MODULES,
      ],
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
            return reply.noChange()
          } else {
            return reply.send(mod)
          }
        })
        .catch((err) => {
          fastify.log.error(err)
          return reply.badRequest(err.message)
        })
    }
  )
}
