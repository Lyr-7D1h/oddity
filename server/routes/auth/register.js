module.exports = fastify => {
  const validateIdentifier = (id, username) => {
    if (id.includes(username.toLowerCase())) {
      const identifier = e.target.value.toLowerCase().replace(' ', '_')
      new RegExp('([a-z])w+')
    }

    return false
  }

  fastify.post(
    `/auth/register`,
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            email: { type: 'string' }
          },
          required: ['username', 'password', 'email']
        }
      }
    },
    (request, reply) => {
      fastify.Role.find({ isDefault: true }, '_id')
        .then(roles => {
          if (roles.length === 1) {
            if ((!validateIdentifier, request.body.username)) {
              return reply.badRequest('Invalid Identifier')
            }

            fastify.crypto.hash(request.body.password).then(hash => {
              const user = {
                username: request.body.username,
                identifier: request.body.identifier,
                email: request.body.email,
                roleId: roles[0]._id,
                password: hash,
                ip: request.ip
              }

              fastify.User.create(user)
                .then(() => reply.success())
                .catch(err => {
                  fastify.log.error(err)
                  return reply.send(fastify.httpErrors.internalServerError())
                })
            })
          } else {
            fastify.log.fatal('Multiple or no Default Roles')
            reply.send(fastify.httpErrors.internalServerError())
          }
        })
        .catch(err => {
          fastify.log.error(err)
          reply.send(fastify.httpErrors.internalServerError())
        })
    }
  )
}
