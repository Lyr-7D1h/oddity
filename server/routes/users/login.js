const { InternalServerError } = require('http-errors')

module.exports = fastify => {
  fastify.get(
    '/users/login',
    {
      preHandler: fastify.auth([
        fastify.verify.basic.portal,
        fastify.verify.basic.user
      ])
    },
    (request, reply) => {
      fastify.User.findById(request.credentials.id, 'username email role')
        .then(user => {
          request.session.user = request.credentials
          reply.setCookie('user', user, {
            httpOnly: !(fastify.config.ENV === 'development'), // set httpOnly and secure off when in dev
            secure: !(fastify.config.ENV === 'development'),
            path: '/'
          })
          reply.send()
        })
        .catch(err => {
          fastify.log.error(err)
          reply.send(new InternalServerError())
        })
    }
  )
}
