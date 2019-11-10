const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const navSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String
    },
    isTitle: Boolean
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
    nav: [navSchema]
  })

  const Config = instance.mongoose.connection.model('Config', configSchema)

  // If there are no configs create a default one
  Config.find({}).then(configs => {
    if (configs.length === 0) {
      Config.create({
        name: 'default',
        isActive: true,
        nav: [{ name: 'Oddity', isTitle: true }]
      })
        .then(() => {
          instance.log.info('Created Default Config')
        })
        .catch(err => {
          instance.log.error(err)
        })
    }
  })

  instance.decorate('Config', Config)
})
