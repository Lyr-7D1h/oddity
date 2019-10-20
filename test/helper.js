'use strict'

// This file contains code that we reuse
// between our tests.

const fp = require('fastify-plugin')
const Fastify = require('fastify')
const App = require('../app')

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {
    CONNECTION_STRING:
      'mongodb+srv://oddityStaging:40vOCy06sago47Pk@staging-ausly.gcp.mongodb.net/staging?retryWrites=true&w=majority',
    PORT: 3000,
    ADMIN_SECRET: 'secret',
    dotenv: true
  }
}

// automatically build and tear down our instance
function build(t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build
}
