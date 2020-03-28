'use strict'

module.exports = async fastify => {
  fastify.get('/modules', (request, reply) => {
    fastify.models.module
      .findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then(modules => {
        return reply.send(modules)
      })
      .catch(err => {
        fastify.log.error(err)
        return reply.internalServerError()
      })
  })
  fastify.put(
    '/modules/:id',
    {
      schema: { params: 'id#' },
      preHandler: [fastify.auth([fastify.authentication.cookie])]
    },
    (request, reply) => {
      if (!request.body) return reply.badRequest()

      console.log(request.params)
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
    }
  )
}
