module.exports = async fastify => {
  fastify.get(
    '/auth/login',
    {
      schema: {
        hide: true // hide from docs
      },
      preHandler: fastify.auth([
        fastify.verify.basic.portal,
        fastify.verify.basic.user
      ])
    },
    (request, reply) => {
      fastify.models.user
        .findOne({ where: { id: request.credentials.id } })
        .then(user => {
          request.session.user = request.credentials

          fastify.models.role
            .findOne({ where: { id: user.roleId } })
            .then(role => {
              const userCookie = {
                id: user.id,
                username: user.username,
                identifier: user.identifier,
                avatar: user.avatar,
                email: user.email
              }

              if (role === null) {
                // TODO: Should not be possible so remove?
                fastify.log.warn('User does not have a role')
              } else {
                userCookie.roleId = role.id.toString()
                userCookie.permissions = role.permissions // TODO: Should be permissions of user + role
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
