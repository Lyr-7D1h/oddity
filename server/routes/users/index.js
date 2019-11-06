'use strict'
const { BadRequest, InternalServerError } = require('http-errors')

module.exports = async (fastify, opts) => {
  fastify.baseRoute(fastify, opts, {
    Model: fastify.User,
    columns: '-password',
    excludeMethods: 'create'
  })

  fastify.post(
    `/${fastify.User.collection.collectionName}`,
    (request, reply) => {
      try {
        new fastify.User(request.body).save(err => {
          if (err) return reply.send(new BadRequest(err.message))
          return fastify.success(reply)
        })
      } catch (err) {
        fastify.log.error(err)
        return reply.send(new InternalServerError())
      }
    }
  )

  // use Auth path
  require('./login')(fastify)
  require('./logout')(fastify)
}
