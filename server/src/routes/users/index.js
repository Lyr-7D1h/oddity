'use strict'

module.exports = async (fastify) => {
  require('./identifier')(fastify)
  require('./preflight')(fastify)

  fastify.put(
    '/users/:id/hasFinishedAccount',
    {
      schema: {
        params: { $ref: 'id#' },
      },
      permissions: fastify.PERMISSIONS.NONE,
      preHandler: fastify.auth([fastify.authorization.cookie]),
    },
    (req, reply) => {
      if (req.session.user.id === req.params.id) {
        fastify.models.user
          .update(
            { hasFinishedAccount: true },
            { where: { id: req.params.id } }
          )
          .then(() => {
            return reply.success()
          })
          .catch((err) => {
            fastify.log.error(err)
            fastify.sentry.captureException(err)
            return reply.internalServerError(err)
          })
      } else {
        return reply.notAuthorized()
      }
    }
  )

  fastify.put(
    '/users/:id/password',
    {
      schema: {
        hide: true,
        params: { $ref: 'id#' },
        body: {
          properties: {
            old_password: { type: 'string' },
            new_password: { type: 'string' },
          },
          required: ['old_password', 'new_password'],
        },
      },
    },
    (req, reply) => {
      console.log(reply)
      fastify.models.user
        .findOne({ attributes: ['password'], where: { id: req.params.id } })
        .then((user) => {
          fastify.crypto
            .validate(req.body.old_password, user.password)
            .then((is_valid) => {
              if (is_valid) {
                fastify.crypto.hash(req.body.new_password).then((new_hash) => {
                  fastify.models.user
                    .update(
                      { password: new_hash },
                      { where: { id: req.params.id } }
                    )
                    .then(() => {
                      return reply.success()
                    })
                    .catch((err) => {
                      fastify.log.error(err)
                      fastify.sentry.captureException(err)
                      return reply.internalServerError(err)
                    })
                })
              } else {
                return reply.unauthorized()
              }
            })
            .catch((err) => {
              fastify.log.error(err)
              fastify.sentry.captureException(err)
              return reply.internalServerError(err)
            })
        })
        .catch((err) => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          return reply.internalServerError(err)
        })
    }
  )

  fastify.put(
    '/users/:id',
    {
      schema: {
        params: { $ref: 'id#' },
        body: {
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password_hash: { type: 'string' },
          },
        },
      },
      preHandler: fastify.auth([fastify.authorization.cookie]),
      permissions: fastify.PERMISSIONS.NONE,
    },
    (req, reply) => {
      fastify.models.user
        .update(req.body, {
          where: { id: req.params.id },
        })
        .then(() => {
          return reply.success()
        })
        .catch((err) => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          return reply.internalServerError(err)
        })
    }
  )

  const excludeAttributes = [
    'password',
    'ip',
    'email',
    'createdAt',
    'updatedAt',
    'permissions',
  ]

  const userRoute = {
    model: fastify.models.user,
    routes: [
      {
        method: 'get',
        multiple: true,
        exclude: excludeAttributes,
        permissions: fastify.PERMISSIONS.PUBLIC,
      },
      {
        method: 'get',
        exclude: excludeAttributes,
        permissions: fastify.PERMISSIONS.PUBLIC,
      },
    ],
  }
  fastify.routeGen(userRoute)
}
