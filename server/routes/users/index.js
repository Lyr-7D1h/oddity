'use strict'
const { InternalServerError } = require('http-errors')

module.exports = async (fastify, opts) => {
  fastify.baseRoute(fastify, opts, {
    Model: fastify.User,
    columns: '-password -ip -eamil',
    excludeMethods: 'create'
  })

  fastify.post(
    `/${fastify.User.collection.collectionName}`,
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          },
          required: ['username', 'password', 'email', 'role']
        }
      }
    },
    (request, reply) => {
      console.log(request.body)
      request.body.ip = request.ip
      fastify.crypto.encryptKey(request.body.password).then(hash => {
        request.body.password = hash
        try {
          new fastify.User(request.body).save(err => {
            if (err) {
              fastify.log.error(err)
              return reply.send(new InternalServerError())
            } else {
              return fastify.success(reply)
            }
          })
        } catch (err) {
          fastify.log.error(err)
          return reply.send(new InternalServerError())
        }
      })
    }
  )

  // use Auth path
  require('./login')(fastify)
  require('./logout')(fastify)
}
