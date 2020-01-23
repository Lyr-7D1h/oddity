'use strict'
const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  /**
   * Easily create routes for basic CRUD Routes
   *
   * @param {string} options.model - Sequelize Model
   * @param {array} options.routes - Routes to use
   * @param {string} options.routes.method - get || delete || post || put
   * @param {boolean} options.routes.multiple - does this route have multiple (/tests) ? otherwise it uses an id in path (/tests/:id)
   * @param {function|array} options.routes.auth - function for authentication preHandling
   * @param {array} options.columns - columns to add or remove
   * @param {array} options.columns.include - Array of strings with columns to include
   * @param {array} options.columns.exclude - Array of strings with columns to exclude
   */
  instance.decorate('routeGen', async options => {
    const { model, routes } = options
    if (!model || !routes || routes.length < 0) {
      throw Error('Invalid Route Options')
    }

    const globalAuthorization = options.auth
    const tableName = model.getTableName()

    const getHandler = (route, method) => {
      const columns = route.columns || {}

      switch (method) {
        case 'GET':
          if (route.multiple) {
            return async (request, reply) => {
              model
                .findAll({ attributes: columns })
                .then(items => {
                  reply.send(items)
                })
                .catch(err => {
                  instance.log.error(err)
                  instance.sentry.captureException(err)
                  reply.internalServerError()
                })
              await reply
            }
          } else {
            return async (request, reply) => {
              model
                .findOne({
                  where: { id: request.params.id, attributes: columns }
                })
                .then(item => {
                  if (!item) reply.notFound()
                  reply.send(item)
                })
                .catch(err => {
                  instance.log.error(err)
                  instance.sentry.captureException(err)
                  reply.internalServerError()
                })
              await reply
            }
          }
        case 'POST':
          if (route.multiple) {
            throw Error('Cannot set multiple on a POST Route')
          }
          if (route.columns) {
            instance.log.warn(
              `(${tableName} Route) No need to specify columns for POST`
            )
          }
          return async (request, reply) => {
            model
              .create(request.body)
              .then(res => {
                reply.send(res)
              })
              .catch(err => {
                instance.log.error(err)
                instance.sentry.captureException(err)
                reply.badRequest()
              })
            await reply
          }
        case 'PUT':
          if (route.multiple) {
            throw Error(`Cannot set multiple on a PUT Route`)
          }
          if (route.columns) {
            instance.log.warn(
              `(${tableName} Route) No need to specify columns for POST`
            )
          }
          return async (request, reply) => {
            model
              .update(request.body)
              .then(response => {
                if (response.nModified === 0) {
                  reply.noChange()
                } else {
                  reply.success()
                }
              })
              .catch(err => {
                instance.log.error(err)
                instance.sentry.captureException(err)
                reply.badRequest()
              })
            await reply
          }
        case 'DELETE':
          if (route.multiple) {
            throw Error('Cannot set multiple on a DELETE Route')
          }
          if (route.columns) {
            instance.log.warn(
              `(${tableName} Route) No need to specify columns for POST`
            )
          }
          return async (request, reply) => {
            model
              .destroy({ where: { id: request.params.id } })
              .then(response => {
                if (response.deletedCount === 0) {
                  return reply.notFound()
                }
                return reply.success()
              })
              .catch(err => {
                instance.log.error(err)
                instance.sentry.captureException(err)
                return reply.badRequest()
              })
            await reply
          }
      }
    }

    const buildOpts = route => {
      let idParam = ''
      const method = route.method.toUpperCase()
      const preHandler = []
      let schema = {}

      if (!route.multiple && method !== 'POST') {
        idParam = '/:id'
        schema = {
          params: 'id#'
        }
      }

      // Add Authentication when auth is present
      let authHandlers = []
      if (globalAuthorization) {
        if (Array.isArray(globalAuthorization)) {
          authHandlers = authHandlers.concat(globalAuthorization)
        } else {
          authHandlers.push(globalAuthorization)
        }
      }
      if (route.auth) {
        if (Array.isArray(route.auth)) {
          authHandlers = authHandlers.concat(route.auth)
        } else {
          authHandlers.push(route.auth)
        }
      }
      if (globalAuthorization || route.auth) {
        preHandler.push(instance.auth(authHandlers))
      }

      // Small validation for custom route
      if (
        route.route &&
        !route.route.includes(':id') === !route.multiple &&
        method !== 'POST'
      ) {
        instance.log.warn('No id for operation on single object')
      }
      if (route.route && route.route.startsWith('/'))
        instance.log.warn("Custom Routes should start without '/' ")

      return {
        method: method,
        url: '/api/' + (route.route || tableName + idParam),
        preHandler: preHandler,
        schema: schema,
        handler: getHandler(route, method)
      }
    }

    for (const i in routes) {
      const route = routes[i]
      if (!route.method) {
        throw Error('No Method defined for route')
      }

      const routeOpts = buildOpts(route)
      instance.route(routeOpts)
    }
  })
})
