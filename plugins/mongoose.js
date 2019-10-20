const mongoose = require('mongoose')

const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  instance.decorate('mongoose', {
    connection: mongoose.createConnection(instance.config.CONNECTION_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    Schema: mongoose.Schema,
    ObjectId: mongoose.Types.ObjectId
  })
})
