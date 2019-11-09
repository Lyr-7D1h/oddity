const mongoose = require('mongoose')

const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const connection = mongoose.createConnection(
    instance.config.CONNECTION_STRING,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )

  connection.on('error', err => {
    instance.log.error(err)
  })

  instance
    .decorate('mongoose', {
      connection: connection,
      Schema: mongoose.Schema,
      ObjectId: mongoose.Types.ObjectId
    })
    .addHook('onClose', (fastify, done) => {
      fastify.mongoose.connection.close(done)
    })
})
