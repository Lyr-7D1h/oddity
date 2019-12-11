module.exports = async fastify => {
  require('./routes')(fastify)

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
