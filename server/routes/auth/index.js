module.exports = async fastify => {
  require('./register')(fastify)
  require('./logout')(fastify)
  require('./login')(fastify)
}
