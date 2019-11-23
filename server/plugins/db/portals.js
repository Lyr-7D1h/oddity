const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const portalSchema = new instance.mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    url: String,
    accessKey: {
      type: String,
      required: true,
      unique: true,
      min: 8,
      max: 30
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
      min: 30,
      max: 80
    }
  })

  const Portal = instance.mongoose.connection.model('Portal', portalSchema)

  instance.decorate('Portal', Portal)
})
