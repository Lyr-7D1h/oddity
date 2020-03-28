const fp = require('fastify-plugin')

/**
 * Makes sure client cookie: user
 * stays in sync with session info
 */
module.exports = fp((instance, _, done) => {
  instance.addHook('onRequest', (request, reply, done) => {
    console.log(request.session)
    if (request.cookies.user && !request.session.user) {
      reply.clearCookie('user')
      done()
    } else if (
      request.session.user &&
      request.session.user.id &&
      !request.cookies.user
    ) {
      instance
        .setUserCookie(reply, reply.session.user.id)
        .then(() => {
          done()
        })
        .catch(err => {
          instance.log.error(err)
          reply.internalServerError(err)
        })
    } else {
      done()
    }
  })
  done()
})
