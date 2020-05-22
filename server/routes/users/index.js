'use strict'

module.exports = async (fastify) => {
  require('./identifier')(fastify)
  require('./preflight')(fastify)

  fastify.put(
    '/users/:id/hasFinishedAccount',
    {
      schema: {
        params: 'id#',
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
    '/users/:id',
    {
      schema: {
        params: 'id#',
        body: {
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
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
        permissions: fastify.PERMISSIONS.NON_SET,
      },
      {
        method: 'get',
        exclude: excludeAttributes,
        permissions: fastify.PERMISSIONS.NON_SET,
      },
    ],
  }
  fastify.routeGen(userRoute)
}
