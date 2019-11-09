const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const permissionSchema = new instance.mongoose.Schema({
    route: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    }
  })
  const roleSchema = new instance.mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    permissions: [permissionSchema]
  })

  const Role = instance.mongoose.connection.model('Role', roleSchema)

  // create default role admin
  Role.findOne({ name: 'admin' }).then(role => {
    if (role === null) {
      Role.create({ name: 'admin', isAdmin: true })
        .then(() => {
          instance.log.info('Created Default Admin Role')
        })
        .catch(err => {
          instance.log.error(err)
        })
    }
  })

  instance.decorate('Role', Role)
})
