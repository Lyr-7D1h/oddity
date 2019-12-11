'use strict'
const fp = require('fastify-plugin')

/**
 * Base Router for basic CRUD Routes
 *
 * Model: Mongoose Model
 *
 * columns: Columns to exclude to not send or only thing to send
 * Format is like "COLUMN1 COLUMN2" to only include these two or
 * "-COLUMN1" to return everything exept COLUMN1
 */
module.exports = fp(async instance => {
  instance.decorate('routeGen', async options => {
    const { model, routes } = options
    if (!model || !routes || routes.length < 0) {
      throw Error('Invalid Route Options')
    }
    const globalAuthorization = options.auth
    const collectionName = model.collection.collectionName

    const getHandler = (route, method) => {
      const columns = route.columns || ''

      switch (method) {
        case 'GET':
          if (route.multiple) {
            return async (request, reply) => {
              model
                .find({}, columns)
                .then(items => {
                  reply.send(items)
                })
                .catch(err => {
                  instance.log.error(err)
                  reply.internalServerError()
                })
              await reply
            }
          } else {
            return async (request, reply) => {
              model
                .findById(request.params.id, columns)
                .then(items => {
                  if (!items) reply.notFound()
                  reply.send(items)
                })
                .catch(err => {
                  instance.log.error(err)
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
              `(${collectionName} Route) No need to specify columns for POST`
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
              `(${collectionName} Route) No need to specify columns for POST`
            )
          }
          return async (request, reply) => {
            model
              .updateOne({ _id: request.params.id }, request.body)
              .then(response => {
                if (response.nModified === 0) {
                  reply.noChange()
                } else {
                  reply.success()
                }
              })
              .catch(err => {
                instance.log.error(err)
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
              `(${collectionName} Route) No need to specify columns for POST`
            )
          }
          return async (request, reply) => {
            model
              .deleteOne({ _id: request.params.id })
              .then(response => {
                if (response.deletedCount === 0) {
                  return reply.notFound()
                }
                return reply.success()
              })
              .catch(err => {
                instance.log.error(err)
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
        preHandler.push(instance.validation.Id)
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
        url: '/api/' + (route.route || collectionName + idParam),
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
