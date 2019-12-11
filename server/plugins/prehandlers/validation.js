const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const Id = (request, reply, next) => {
    if (instance.mongoose.Types.ObjectId.isValid(request.params.id)) {
      next()
    } else {
      reply.badRequest('Invalid Id')
    }
  }
  instance.decorate('validation', {
    Id
  })
})
