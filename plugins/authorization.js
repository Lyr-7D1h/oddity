const fp = require('fastify-plugin')
const auth = require('basic-auth')
const { Unauthorized, InternalServerError } = require('http-errors')

module.exports = fp(async instance => {
  instance.addHook('preHandler', (request, reply, next) => {
    const user = auth(request)
    if (user && user.name && user.pass) {
      instance.Portal.find({ accessKey: user.name }, 'secretKey')
        .then(portals => {
          if (portals.length > 0) {
            instance.crypto
              .validateKey(user.pass, portals[0].secretKey)
              .then(isValid => {
                if (isValid) {
                  return next()
                }
              })
              .catch(err => {
                instance.log.error(err)
                return reply.send(new InternalServerError())
              })
          }
        })
        .catch(err => {
          instance.log.error(err)
        })
    } else {
      reply.send(new Unauthorized())
    }
  })
})
