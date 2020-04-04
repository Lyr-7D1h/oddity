'use strict'
const fp = require('fastify-plugin')
const path = require('path')

const getHandler = (route, model, instance) => {
  const columns = route.columns || {}

  switch (route.method) {
    case 'GET':
      if (route.multiple) {
        return (request, reply) => {
          model
            .findAll({ attributes: columns })
            .then((items) => {
              return reply.send(items)
            })
            .catch((err) => {
              instance.log.error(err)
              instance.sentry.captureException(err)
              return reply.internalServerError()
            })
        }
      } else {
        return (request, reply) => {
          model
            .findOne({
              where: { id: request.params.id, attributes: columns },
            })
            .then((item) => {
              if (!item) reply.notFound()
              return reply.send(item)
            })
            .catch((err) => {
              instance.log.error(err)
              instance.sentry.captureException(err)
              return reply.internalServerError()
            })
        }
      }
    case 'POST':
      if (route.multiple) {
        throw Error('Cannot set multiple on a POST Route')
      }
      if (route.columns) {
        instance.log.warn(
          `(${route.method}:${route.path} Route) No need to specify columns for POST`
        )
      }
      return (request, reply) => {
        model
          .create(request.body)
          .then((res) => {
            return reply.send(res)
          })
          .catch((err) => {
            instance.log.error(err)
            instance.sentry.captureException(err)
            return reply.badRequest()
          })
      }
    case 'PATCH':
      if (route.multiple) {
        throw Error(`Cannot set multiple on a PUT Route`)
      }
      if (route.columns) {
        instance.log.warn(
          `(${route.method}:${route.path} Route) No need to specify columns for POST`
        )
      }
      return (request, reply) => {
        model
          .patch(request.body)
          .then((response) => {
            if (response.nModified === 0) {
              return reply.noChange()
            } else {
              return reply.success()
            }
          })
          .catch((err) => {
            instance.log.error(err)
            instance.sentry.captureException(err)
            return reply.badRequest()
          })
      }

    case 'PUT':
      if (route.multiple) {
        throw Error(`Cannot set multiple on a PUT Route`)
      }
      if (route.columns) {
        instance.log.warn(
          `(${route.method}:${route.path} Route) No need to specify columns for POST`
        )
      }
      return (request, reply) => {
        model
          .update(request.body)
          .then((response) => {
            if (response.nModified === 0) {
              return reply.noChange()
            } else {
              return reply.success()
            }
          })
          .catch((err) => {
            instance.log.error(err)
            instance.sentry.captureException(err)
            return reply.badRequest()
          })
      }
    case 'DELETE':
      if (route.multiple) {
        throw Error('Cannot set multiple on a DELETE Route')
      }
      if (route.columns) {
        instance.log.warn(
          `(${route.method}:${route.path} Route) No need to specify columns for POST`
        )
      }
      return (request, reply) => {
        model
          .destroy({ where: { id: request.params.id } })
          .then((response) => {
            if (response.deletedCount === 0) {
              return reply.notFound()
            }
            return reply.success()
          })
          .catch((err) => {
            instance.log.error(err)
            instance.sentry.captureException(err)
            return reply.badRequest()
          })
      }
  }
}

const buildOpts = (route, model, instance) => {
  return {
    method: route.method,
    url: path.join('/api/', route.path), //route.route || tableName + idParam),
    preHandler: route.preHandler,
    schema: route.schema,
    permissions: route.permissions,
    handler: getHandler(route, model, instance),
  }
}

const validateOptions = (options) => {
  if (!options) {
    throw new Error('Route gen no options provided')
  }

  if (!options.model || !options.routes || options.routes.length <= 0) {
    throw new Error('Invalid model or no routes provided')
  }

  if (!options.model.getTableName) {
    throw new Error('Invalid model')
  }

  // Make sure options.preHandler is an array
  if (options.preHandler) {
    if (!Array.isArray(options.preHandler)) {
      options.preHandler = [options.preHandler]
    }
  } else {
    options.preHandler = []
  }

  // Validate routes
  options.routes.forEach((route) => {
    if (!route.method) {
      throw new Error(`No method defined for route ${route}`)
    }
    if (route.permissions === null || route.permissions === undefined) {
      throw new Error('No permissions given')
    }

    route.method = route.method.toUpperCase()
    // make sure preHandler is an array
    if (options.preHandler) {
      if (!Array.isArray(options.preHandler)) {
        route.preHandler = [options.preHandler]
      }
    } else {
      options.preHandler = []
    }
    route.schema = {}
    route.path = route.path || options.model.getTableName()

    // if no multiple set and is not post method make path for single route
    if (!route.multiple && route.method !== 'POST') {
      route.path = path.join(route.path, '/:id')
      route.schema.params = 'id#'
    }

    // add global prehandlers to route prehandlers
    if (route.auth || options.auth) {
      if (!Array.isArray(route.auth)) {
        route.preHandler = [route.auth]
      }
      route.preHandler = route.preHandler.concat(options.preHandler)
    }
  })

  const result = {
    model: options.model,
    routes: options.routes,
  }

  return result
}

module.exports = fp(async (instance) => {
  instance.decorate(
    'routeGen',
    /**
     * Easily create routes for basic CRUD Routes
     *
     * @param {string} options.model - Sequelize Model
     * @param {array} options.routes - Routes to use
     * @param {function|array} options.preHandler - Prehandler to use for all routes
     * @param {string} options.routes.method - get || delete || post || put
     * @param {boolean} options.routes.multiple - does this route have multiple (/tests) ? otherwise it uses an id in path (/tests/:id)
     * @param {function|array} options.routes.preHandler - function for authentication preHandling
     * @param {array} options.columns.include - Array of strings with columns to include
     * @param {array} options.columns.exclude - Array of strings with columns to exclude
     */
    (options) => {
      options = validateOptions(options)

      options.routes.forEach((route) => {
        const routeOpts = buildOpts(route, options.model, instance)
        instance.route(routeOpts)
      })
    }
  )
})
