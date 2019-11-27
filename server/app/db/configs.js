const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const moduleSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String
    },
    route: {
      required: true,
      type: String,
      lowercase: true
    },
    config: {
      type: String,
      lowercase: true
    }
  })
  const configSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String,
      unique: true
    },
    isActive: {
      required: true,
      type: Boolean
    },
    title: {
      required: true,
      type: String
    },
    logoUrl: {
      type: String
    },
    modules: [moduleSchema]
  })

  const Config = instance.mongoose.connection.model('Config', configSchema)

  instance.decorate('Config', Config)
})
