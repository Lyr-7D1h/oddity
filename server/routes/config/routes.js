module.exports = async fastify => {
  const validateIds = (request, reply, next) => {
    const validConfigId = fastify.mongoose.Types.ObjectId.isValid(
      request.params.configId
    )
    const validRouteId = fastify.mongoose.Types.ObjectId.isValid(
      request.params.routeId
    )
    if (validConfigId && validRouteId) {
      next()
    } else {
      reply.badRequest('Invalid Id')
    }
  }

  const bodySchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      path: { type: 'string' },
      module: { type: 'string' },
      default: { type: 'boolean' }
    },
    required: ['name', 'path', 'module']
  }

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
        body: bodySchema
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

        let routes = config.routes

        // only one path can be default inside of document
        if (request.body.default) {
          for (const i in routes) {
            if (routes[i].default && routes[i]._id != request.params.routeId) {
              return reply.badRequest('Only one path can be default')
            }
          }
        } else {
          // path cannot be empty
          if (request.body.path == '') {
            return reply.badRequest('Only default path can have a empty path')
          }
        }

        // path should be unique unless it is default
        for (const i in routes) {
          if (!routes[i].default) {
            if (routes[i].path === request.body.path) {
              return reply.badRequest('Path must be unqiue')
            }
          }
        }

        const route = new fastify.Route(request.body)
        routes.push(route)

        config
          .save()
          .then(() => {
            reply.send(route)
          })
          .catch(err => {
            fastify.log.error(err)
            reply.badRequest()
          })
      })
    }
  )

  fastify.patch(
    '/configs/:configId/routes/:routeId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            configId: { type: 'string' },
            routeId: { type: 'string' }
          },
          required: ['configId', 'routeId']
        },
        body: bodySchema
      },
      preHandler: [
        validateIds,
        fastify.auth([fastify.verify.cookie, fastify.verify.basic.user])
      ]
    },
    (request, reply) => {
      fastify.Config.findById(request.params.configId).then(config => {
        if (config === null) {
          return reply.notFound('Could not find config')
        }

        let routes = config.routes

        // only one path can be default inside of document
        if (request.body.default) {
          for (const i in routes) {
            if (routes[i].default && routes[i]._id != request.params.routeId) {
              return reply.badRequest('Only one path can be default')
            }
          }
        } else {
          // if not default path cannot be empty
          if (request.body.path == '') {
            return reply.badRequest('Only default path can have a empty path')
          }
        }

        // path should be unique unless it is default
        for (const i in routes) {
          if (!routes[i].default) {
            if (routes[i]._id != request.params.routeId) {
              // dont check current item
              if (routes[i].path === request.body.path) {
                return reply.badRequest('Path must be unqiue')
              }
            }
          }
        }

        // replace route
        let found = false
        for (const i in routes) {
          const { _id } = routes[i]
          if (_id == request.params.routeId) {
            found = true
            routes.splice(i, 1, request.body)
          }
        }
        if (!found) {
          return reply.notFound('Could not find route')
        }

        config
          .save()
          .then(() => {
            reply.success()
          })
          .catch(err => {
            fastify.log.error(err)
            reply.badRequest()
          })
      })
    }
  )
  fastify.delete(
    '/configs/:configId/routes/:routeId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            configId: { type: 'string' },
            routeId: { type: 'string' }
          },
          required: ['configId', 'routeId']
        }
      },
      preHandler: [
        validateIds,
        fastify.auth([fastify.verify.cookie, fastify.verify.basic.user])
      ]
    },
    (request, reply) => {
      fastify.Config.findById(request.params.configId).then(config => {
        if (config === null) {
          return reply.notFound('Could not find config')
        }

        let routes = config.routes

        // Remove when found
        let found = false
        for (const i in routes) {
          const { _id } = routes[i]
          if (_id == request.params.routeId) {
            found = true
            routes.splice(i, 1)
          }
        }
        if (!found) {
          return reply.notFound('Could not find route')
        }

        config
          .save()
          .then(() => {
            reply.success()
          })
          .catch(err => {
            fastify.log.error(err)
            reply.badRequest()
          })
      })
    }
  )
}
