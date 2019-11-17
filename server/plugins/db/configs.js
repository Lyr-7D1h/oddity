const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const titleSchema = new instance.mongoose.Schema({
    title: {
      required: true,
      type: String
    },
    logoUrl: {
      type: String
    }
  })
  const navSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      type: String
    },
    parent: {
      type: instance.mongoose.ObjectId
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
    title: titleSchema,
    nav: [navSchema]
  })

  const Config = instance.mongoose.connection.model('Config', configSchema)

  // If there are no configs create a default one
  Config.find({}).then(configs => {
    if (configs.length === 0) {
      Config.create({
        name: 'default',
        isActive: true,
        title: { title: 'Oddity' },
        nav: [{ name: 'forum' }, { name: 'servers' }]
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
