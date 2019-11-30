module.exports = async fastify => {
  fastify.get('/config', (request, reply) => {
    fastify.Config.findOne({})
      .then(config => {
        reply.send(config)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.send(fastify.httpErrors.internalServerError())
      })
  })

  fastify.post('/config', (request, reply) => {
    try {
      new fastify.Config(request.body).save(err => {
        if (err) {
          fastify.log.error(err)
          return reply.send(fastify.httpErrors.badRequest())
        }
        return fastify.success(reply)
      })
    } catch (err) {
      fastify.log.error(err)
      return reply.send(fastify.httpErrors.internalServerError())
    }
  })

  fastify.put(
    '/config/:id',
    // {
    //   // preHandler: [validateId], TODO: Make ValidateId Global
    //   schema: {
    //     params: 'id#'
    //   }
    // },
    (request, reply) => {
      fastify.Config.updateOne({ _id: request.params.id }, request.body)
        .then(response => {
          if (response.nModified === 0) {
            reply.code(204)
            return reply.send('No Changes')
          }
          return fastify.success(reply)
        })
        .catch(err => {
          fastify.log.error(err)
          return reply.send(fastify.httpErrors.badRequest)
        })
    }
  )
}
