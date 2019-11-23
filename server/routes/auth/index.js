module.exports = async (fastify, opts) => {
  require('./register')(fastify)
  require('./logout')(fastify)
  require('./login')(fastify)
}
