'use strict'

module.exports = async (fastify, opts) => {
  const portalSchema = require('./schema')(fastify.mongoose.Schema)
  fastify.baseRoute(fastify, opts, {
    Model: fastify.mongoose.connection.model('Portal', portalSchema),
    columns: 'name url'
  })
}
