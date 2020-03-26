module.exports = async fastify => {
  fastify.get(
    '/configs/:id/routes',
    {
      schema: {
        params: 'id#'
      }
    },
    (request, reply) => {
      fastify.models.route
        .findAll({
          where: { configId: request.params.id }
        })
        .then(routes => {
          reply.send(routes)
        })
        .catch(err => {
          fastify.log.error(err)
          fastify.sentry.captureException(err)
          fastify.internalServerError()
        })
    }
  )

  fastify.patch(
    '/configs/:id/routes',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        body: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              moduleId: { type: 'integer' },
              default: { type: 'boolean' }
            },
            required: ['path', 'moduleId']
          }
        }
      },
      preHandler: [
        fastify.auth([
          fastify.authentication.cookie,
          fastify.authentication.basic
        ])
      ]
    },
    (request, reply) => {
      fastify.models.config
        .findOne({
          where: { id: request.params.id },
          include: [{ model: fastify.models.route }]
        })
        .then(config => {
          if (config === null) {
            return reply.notFound('Could not find config')
          }

          const routes = request.body

          // only 1 default
          if (routes.filter(route => route.default).length !== 1) {
            return reply.badRequest('There should always be one path default')
          }

          const checkRoutes = []
          for (const i in routes) {
            // path cannot be empty if not default
            if (routes[i].path == '' && !routes[i].default) {
              return reply.badRequest('Only default path can have a empty path')
            }

            for (const j in checkRoutes) {
              if (checkRoutes[j].path == routes[i].path) {
                return reply.badRequest('Path should be unique')
              }
            }

            checkRoutes.push(routes[i])
          }

          const promises = []

          // TODO: Fix loop updating
          config.routes.forEach(route => {
            // if cant find delete category
            if (
              !routes.includes(
                reqRoute => reqRoute.id && reqRoute.id === route.id
              )
            ) {
              promises.push(
                fastify.models.route.destroy({
                  where: { id: route.id }
                })
              )
            }
          })

          request.body.forEach(category => {
            promises.push(
              fastify.models.route.upsert(category, { returning: true })
            )
          })

          Promise.all(promises)
            .then(results => {
              results = results.filter(result => isNaN(result) && result) // filter out results of delete
              reply.send(results.map(result => result[0]))
            })
            .catch(err => {
              fastify.log.error(err)
              fastify.sentry.captureException(err)
              reply.internalServerError()
            })
        })
    }
  )
}
