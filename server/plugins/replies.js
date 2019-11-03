const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.decorate('success', async reply => {
    reply.code(200).send({
      message: 'success'
    })
  })
})
