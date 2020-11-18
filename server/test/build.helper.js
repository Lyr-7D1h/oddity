'use strict'

const fp = require('fastify-plugin')
const Fastify = require('fastify')
const { schema, data } = require('./config.helper')

/**
 * Build the test version of our app
 * @param {object} test - Test object
 * @param {object} opts - Options for app helper
 */
module.exports = (test, opts) => {
  process.on('uncaughtException', (err) => () => {
    console.error('UNCAUGHT ERROR')
    test.error(err)
  })

  const app = Fastify()

  // Set Fastify Env with env variables defined here
  app.register(require('fastify-env'), {
    schema: schema,
    data: data,
  })

  // Create test sentry
  app.decorate('sentry', {
    captureException: (err) => {
      throw err
    },
  })

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(require('./app.helper'), opts))

  // tear down our app after we are done
  test.tearDown(() => {
    // Overwrite exitCode to 0 when tearing down
    // Fastify always sets exitCode to 1 when closing
    process.on('exit', () => {
      process.exitCode = 0
    })

    app.close()
  })

  return app
}
