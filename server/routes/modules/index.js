'use strict'

module.exports = async fastify => {
  fastify.get('/modules', (request, reply) => {
    fastify.models.module
      .findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
      .then(modules => {
        reply.send(modules)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.internalServerError()
      })
  })
}
