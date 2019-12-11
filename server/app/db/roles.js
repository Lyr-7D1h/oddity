const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const colorValidator = v => /^#([0-9a-f]{3}){1,2}$/i.test(v)
  const roleSchema = new instance.mongoose.Schema({
    name: {
      required: true,
      unqiue: true,
      type: String
    },
    isDefault: {
      type: Boolean
    },
    color: {
      type: String,
      validator: [colorValidator, 'Invalid color']
    },
    permissions: {
      type: Number,
      required: true
    }
  })

  const Role = instance.mongoose.connection.model('Role', roleSchema)

  instance.decorate('Role', Role)
})
