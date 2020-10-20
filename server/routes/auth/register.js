module.exports = (fastify) => {
  fastify.post(
    `/auth/register`,
    {
      schema: {
        hide: true, // hide from docs
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            identifier: { type: 'string' },
            password: { type: 'string' },
            password_confirm: { type: 'string' },
            email: { type: 'string' },
            agreement: { type: 'boolean' },
            captcha: { type: 'string' },
          },
          required: [
            'username',
            'identifier',
            'password',
            'password_confirm',
            'email',
            'agreement',
            'captcha',
          ],
        },
      },
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    (request, reply) => {
      if (!request.body.agreement) {
        return reply.badRequest('You must accept to the agreement')
      }
      if (request.body.password !== request.body.password_confirm) {
        return reply.badRequest('Passwords don not equal')
      }
      if (!fastify.validateIdentifier(request.body.identifier)) {
        return reply.badRequest('Invalid Identifier')
      }

      fastify
        .captcha(request.body.captcha, request.ip)
        .then((isValid) => {
          if (isValid) {
            fastify.models.role
              .findOne({ where: { isDefault: true } })
              .then((role) => {
                if (role) {
                  fastify.crypto.hash(request.body.password).then((hash) => {
                    const user = {
                      username: request.body.username,
                      identifier: request.body.identifier,
                      email: request.body.email,
                      roleId: role.id,
                      password: hash,
                      ip: request.ip,
                    }

                    fastify.models.user
                      .create(user)
                      .then(() => {
                        return reply.success()
                      })
                      .catch((err) => {
                        fastify.log.error(err)
                        fastify.sentry.captureException(err)
                        return reply.send(
                          fastify.httpErrors.internalServerError()
                        )
                      })
                  })
                } else {
                  fastify.sentry.captureException(new Error('No Default Role'))
                  fastify.log.fatal('No Default Role')
                  return reply.internalServerError()
                }
              })
              .catch((err) => {
                fastify.log.error(err)
                fastify.sentry.captureException(err)
                return reply.internalServerError()
              })
          } else {
            return reply.internalServerError('Invalid captcha')
          }
        })
        .catch((err) => {
          fastify.sentry.captureException(err)
          fastify.log.error(err)
          return reply.internalServerError('Could not validate captcha')
        })
    }
  )
}
