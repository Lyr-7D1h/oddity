'use strict'

module.exports = async (fastify, opts) => {
  fastify.baseRoute(fastify, opts, {
    Model: fastify.User,
    columns: '-password'
  })

  // use Auth path
  require("./auth")(fastify);
}
