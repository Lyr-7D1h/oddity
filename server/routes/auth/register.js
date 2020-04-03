module.exports = fastify => {
  fastify.post(
    `/auth/register`,
    {
      schema: {
        hide: true, // hide from docs
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' }
          },
          required: ['username', 'password', 'email']
        }
      },
      permissions: fastify.PERMISSIONS.NON_SET
    },
    (request, reply) => {
      fastify.models.role
        .findOne({ where: { isDefault: true } })
        .then(role => {
          if (role) {
            if (!fastify.validateIdentifier(request.body.identifier)) {
              return reply.badRequest('Invalid Identifier')
            }

            fastify.crypto.hash(request.body.password).then(hash => {
              const user = {
                username: request.body.username,
                identifier: request.body.identifier,
                email: request.body.email,
                roleId: role.id,
                password: hash,
                ip: request.ip
              }

              fastify.models.user
                .create(user)
                .then(() => reply.success())
                .catch(err => {
                  fastify.log.error(err)
                  fastify.sentry.captureException(err)
                  return reply.send(fastify.httpErrors.internalServerError())
                })
            })
          } else {
            fastify.sentry.captureException(new Error('No Default Role'))
            fastify.log.fatal('No Default Role')
            reply.internalServerError()
          }
        })
        .catch(err => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          reply.internalServerError()
        })
    }
  )
}
