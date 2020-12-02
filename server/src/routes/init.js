module.exports = async (fastify) => {
  fastify.get(
    '/init',
    { permissions: fastify.PERMISSIONS.PUBLIC },
    (request, reply) => {
      const initPromises = []
      initPromises.push(
        fastify.models.config.findOne({
          where: { isActive: true },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        })
      )

      initPromises.push(
        fastify.models.module.findAll({
          where: { enabled: true },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        })
      )

      Promise.all(initPromises)
        .then(([config, modules]) => {
          reply.send({
            config,
            modules,
            permissions: fastify.PERMISSIONS,
            captcha: fastify.config.CAPTCHA_CLIENT,
          })
        })
        .catch((err) => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.send(fastify.httpErrors.internalServerError())
        })
    }
  )
}
