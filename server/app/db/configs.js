const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  let routeSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String
    },
    // Should be unique within document
    route: {
      required: true,
      type: instance.mongoose.Types.EmptyString,
      lowercase: true
    },
    // should only be one default
    default: {
      type: Boolean
    },
    module: {
      type: String,
      lowercase: true,
      enum: ['servers', 'members', 'forum', 'home']
    }
  })

  const configSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String,
      unique: true
    },
    // should only be one active
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
    routes: [routeSchema]
  })

  const Config = instance.mongoose.connection.model('Config', configSchema)

  instance.decorate('Config', Config)
})
