const { InternalServerError } = require('http-errors')

module.exports = async fastify => {
  fastify.get('/config', (request, reply) => {
    console.log(request.Cookie)
    fastify.Config.findOne({})
      .then(config => {
        reply.send(config)
      })
      .catch(err => {
        fastify.log.error(err)
        reply.send(new InternalServerError())
      })
  })

  //   fastify.post('/config', (request, reply) => {
  //     fastify.Config.findOne({})
  //       .then(config => {
  //         reply.send(config)
  //       })
  //       .catch(err => {
  //         fastify.log.error(err)
  //         reply.send(new InternalServerError())
  //       })
  //   })
}
