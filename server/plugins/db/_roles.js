const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const colorValidator = v => /^#([0-9a-f]{3}){1,2}$/i.test(v)
  const roleSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      unique: true,
      lowercase: true,
      type: String
    },
    nameRaw: {
      required: true,
      type: String
    },
    color: {
      type: String,
      validator: [colorValidator, 'Invalid color']
    },
    permission: {
      type: Number,
      required: true
    }
  })

  const Role = instance.mongoose.connection.model('Role', roleSchema)

  // create default role admin
  Role.findOne({ name: 'admin' }).then(role => {
    if (role === null) {
      Role.create({ name: 'admin', nameRaw: 'Admin', permission: 1 })
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
