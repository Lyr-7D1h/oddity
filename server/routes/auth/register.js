module.exports = fastify => {
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
            fastify.crypto.encryptKey(request.body.password).then(hash => {
              const user = {
                username: request.body.username,
                identifier: request.body.username,
                email: request.body.email,
                roleId: roles[0]._id,
                password: hash,
                ip: request.ip
              }
              console.log(user)

              fastify.User.create(user)
                .then(() => fastify.success(reply))
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
