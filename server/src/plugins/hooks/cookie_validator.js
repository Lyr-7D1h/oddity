const fp = require('fastify-plugin')

/**
 * Makes sure client cookie: user
 * stays in sync with session info
 */
// TODO: update cookie when user updated
module.exports = fp((instance, _, done) => {
  instance.addHook('preHandler', (request, reply, done) => {
    if (request.cookies.user && !request.session.user) {
      reply.clearCookie('user')
      done()
    } else if (
      request.session.user &&
      request.session.user.id &&
      !request.cookies.user
    ) {
      instance
        .setUserCookie(reply, request.session.user.id)
        .then(() => {
          done()
        })
        .catch(() => {
          request.destroySession((err) => {
            if (err) instance.log.error(err)
            reply.internalServerError()
          })
        })
    } else {
      done()
    }
  })
  done()
})
