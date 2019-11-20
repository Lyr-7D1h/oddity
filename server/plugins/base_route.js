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
  instance.decorate(
    'baseRoute',
    async (fastify, opts, { Model, columns, excludeMethods }) => {
      const collectionName = Model.collection.collectionName
      columns = columns || ''
      excludeMethods = Array.isArray(excludeMethods)
        ? excludeMethods
        : [excludeMethods]

      fastify.log.info(`Controller for "${collectionName}" initialized`)

      const validateId = (request, reply, next) => {
        if (fastify.mongoose.ObjectId.isValid(request.params.id)) {
          return next()
        } else {
          return reply.send(instance.httpErrors.badRequest())
        }
      }

      if (!excludeMethods.includes('create')) {
        /**
         * Create
         */
        fastify.post(`/${collectionName}`, (request, reply) => {
          try {
            new Model(request.body).save(err => {
              if (err) return reply.send(instance.httpErrors.badRequest())
              return fastify.success(reply)
            })
          } catch (err) {
            fastify.log.error(err)
            return reply.send(instance.httpErrors.internalServerError())
          }
        })
      }

      if (!excludeMethods.includes('get all')) {
        /**
         * Get All
         */
        fastify.get(`/${collectionName}`, (request, reply) => {
          Model.find({}, columns)
            .then(items => {
              return reply.send(items)
            })
            .catch(err => {
              fastify.log.error(err)
              return reply.send(instance.httpErrors.internalServerError())
            })
        })
      }

      if (!excludeMethods.includes('get')) {
        /**
         * Get
         */
        fastify.get(
          `/${collectionName}/:id`,
          {
            preHandler: [validateId],
            schema: {
              params: 'id#'
            }
          },
          (request, reply) => {
            Model.findById(request.params.id, columns)
              .then(items => {
                if (!items) return reply.send(instance.httpErrors.notFound())
                return reply.send(items)
              })
              .catch(err => {
                fastify.log.error(err)
                return reply.send(instance.httpErrors.internalServerError())
              })
          }
        )
      }

      if (!excludeMethods.includes('update')) {
        /**
         * Update
         */
        fastify.put(
          `/${collectionName}/:id`,
          {
            preHandler: [validateId],
            schema: {
              params: 'id#'
            }
          },
          (request, reply) => {
            Model.updateOne({ _id: request.params.id }, request.body)
              .then(response => {
                if (response.nModified === 0) {
                  return reply.send(instance.httpErrors.notFound())
                }
                return fastify.success(reply)
              })
              .catch(err => {
                fastify.log.error(err)
                return reply.send(instance.httpErrors.badRequest)
              })
          }
        )
      }

      if (!excludeMethods.includes('delete')) {
        /**
         * Delete
         */
        fastify.delete(
          `/${collectionName}/:id`,
          {
            preHandler: [validateId],
            schema: {
              params: 'id#'
            }
          },
          (request, reply) => {
            Model.deleteOne({ _id: request.params.id })
              .then(response => {
                if (response.deletedCount === 0) {
                  return reply.send(instance.httpErrors.notFound())
                }
                return fastify.success(reply)
              })
              .catch(err => {
                fastify.log.error(err)
                return reply.send(instance.httpErrors.badRequest())
              })
          }
        )
      }
    }
  )
})
