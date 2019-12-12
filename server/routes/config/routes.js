module.exports = async fastify => {
  fastify.post(
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
              name: { type: 'string' },
              path: { type: 'string' },
              module: { type: 'string' },
              default: { type: 'boolean' }
            },
            required: ['name', 'path', 'module']
          }
        }
      },
      preHandler: [
        fastify.validation.Id,
        fastify.auth([fastify.verify.cookie, fastify.verify.basic.user])
      ]
    },
    (request, reply) => {
      fastify.Config.findById(request.params.id).then(config => {
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

        config.routes = routes

        config
          .save()
          .then(config => {
            reply.send(config.routes)
          })
          .catch(err => {
            fastify.log.error(err)
            reply.badRequest()
          })
      })
    }
  )
}
