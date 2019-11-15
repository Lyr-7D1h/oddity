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
      fastify.User.findById(request.credentials.id)
        .then(user => {
          request.session.user = request.credentials

          fastify.Role.findById(user.roleId)
            .then(role => {
              if (role === null) {
                throw Error('User does not have a role')
              }

              const userCookie = {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                roleId: role._id.toString(),
                permissions: role.permissions
              }

              reply.setCookie('user', JSON.stringify(userCookie), {
                httpOnly: !(fastify.config.NODE_ENV === 'development'), // set httpOnly and secure off when in dev
                secure: !(fastify.config.NODE_ENV === 'development'),
                path: '/'
              })
              reply.send()
            })
            .catch(err => {
              fastify.log.error(err)
              reply.send(new InternalServerError())
            })
        })
        .catch(err => {
          fastify.log.error(err)
          reply.send(new InternalServerError())
        })
    }
  )
}
