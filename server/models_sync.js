/**
 * Only use outside of server context
 *
 * Meant to only syncronize the models
 */

const Fastify = require('fastify')
require('dotenv').config()

const instance = Fastify({
  dotenv: true,
})

const schema = {
  type: 'object',
  required: ['DB_NAME', 'DB_USERNAME', 'DB_PASSWORD'],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
  },
}

instance
  .register(require('fastify-env'), {
    schema,
  })
  .register(require('./plugins/sequelize'))

  .register(require('./plugins/decorators/models'))

instance.ready(() => {
  console.log('Models Syncronized')
  process.exit(0)
})
