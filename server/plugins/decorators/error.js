const fp = require('fastify-plugin')

module.exports = fp(async (instance) => {
  instance.decorate('httpError', (error) => {
    instance.log.error(error)
    instance.sentry.captureException(error)
    //TODO: return proper httpError
  })
  instance.decorate('error', (error) => {
    instance.log.error(error)
    instance.sentry.captureException(error)
  })
})
