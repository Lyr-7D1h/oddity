module.exports = async fastify => {
  fastify.get(
    '/auth/login',
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
              const userCookie = {
                _id: user._id.toString(),
                username: user.username,
                identifier: user.identifier,
                avatar: user.avatar,
                email: user.email
              }

              if (role === null) {
                fastify.log.warn('User does not have a role')
              } else {
                userCookie.roleId = role._id.toString()
                userCookie.permissions = role.permissions
              }

              reply.setCookie('user', JSON.stringify(userCookie), {
                httpOnly: false, // Should always be false because js needs to interact with this
                secure: !(fastify.config.NODE_ENV === 'development'),
                path: '/'
              })
              reply.send()
            })
            .catch(err => {
              fastify.log.error(err)
              reply.send(fastify.httpErrors.internalServerError())
            })
        })
        .catch(err => {
          fastify.log.error(err)
          reply.send(fastify.httpErrors.internalServerError())
        })
    }
  )
}
