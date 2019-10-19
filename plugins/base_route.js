'use strict'
const { NotFound, BadRequest, InternalServerError } = require('http-errors')
const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.decorate('baseRoute', async (fastify, opts, { Model }) => {
    const collectionName = Model.collection.collectionName
    fastify.log.info(`Controller for ${collectionName} initialized`)

    const validateId = (request, reply, next) => {
      if (fastify.mongoose.ObjectId.isValid(request.params.id)) {
        return next()
      } else {
        return reply.send(new BadRequest())
      }
    }

    /**
     * Create
     */
    fastify.post(`/${collectionName}`, (request, reply) => {
      try {
        new Model(request.body).save(err => {
          if (err) return reply.send(new BadRequest(err.message))
          return fastify.success(reply)
        })
      } catch (err) {
        fastify.log.error(err)
        return reply.send(new InternalServerError())
      }
    })

    /**
     * Read All
     */
    fastify.get(`/${collectionName}`, (request, reply) => {
      Model.find({})
        .then(items => {
          return reply.send(items)
        })
        .catch(err => {
          fastify.log.error(err)
          return reply.send(new InternalServerError())
        })
    })

    /**
     * Read
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
        Model.findById(request.params.id)
          .then(items => {
            if (!items) return reply.send(new NotFound())
            return reply.send(items)
          })
          .catch(err => {
            fastify.log.error(err)
            return reply.send(new InternalServerError('something went wrong'))
          })
      }
    )

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
              return reply.send(new NotFound())
            }
            return fastify.success(reply)
          })
          .catch(err => {
            fastify.log.error(err)
            return reply.send(new BadRequest())
          })
      }
    )

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
              return reply.send(new NotFound())
            }
            return fastify.success(reply)
          })
          .catch(err => {
            fastify.log.error(err)
            return reply.send(new BadRequest())
          })
      }
    )
  })
})
