const mongoose = require('mongoose')
const fp = require('fastify-plugin')

// call validate for update aswell
// mongoose.set('runValidators', true) // Not needed now

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
    instance.log.fatal(err)
  })

  // Types + Custom Types
  const types = mongoose.Types

  // this string can be empty
  const EmptyString = mongoose.Schema.Types.String
  EmptyString.checkRequired(v => v != null)

  types.EmptyString = EmptyString

  await connection.on('connected', () => {
    instance
      .decorate('mongoose', {
        connection: connection,
        Schema: mongoose.Schema,
        Types: types
      })
      .addHook('onClose', (fastify, done) => {
        fastify.mongoose.connection.close(done)
      })
  })
})
