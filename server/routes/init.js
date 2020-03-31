module.exports = async fastify => {
  fastify.get('/init', (request, reply) => {
    const initPromises = []
    initPromises.push(
      fastify.models.config.findOne({
        where: { isActive: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
    )

    initPromises.push(
      fastify.models.module.findAll({
        where: { enabled: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
    )

    Promise.all(initPromises)
      .then(([config, modules]) => {
        reply.send({ config, modules })
      })
      .catch(err => {
        fastify.log.error(err)
        fastify.sentry.captureException(err)
        reply.send(fastify.httpErrors.internalServerError())
      })
  })
}
