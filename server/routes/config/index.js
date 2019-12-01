module.exports = async fastify => {
  fastify.routeGen({
    model: fastify.Config,
    routes: [
      {
        method: 'get',
        multiple: true
      },
      {
        method: 'get'
      },
      {
        method: 'post'
      },
      {
        method: 'delete'
      },
      {
        method: 'put'
      }
    ]
  })

  // Get Default Config
  fastify.get('/config', (request, reply) => {
    fastify.Config.findOne({ isActive: true })
      .then(config => {
        reply.send(config)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.send(fastify.httpErrors.internalServerError())
      })
  })
}
