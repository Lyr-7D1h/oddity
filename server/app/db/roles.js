const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  const seq = instance.db.Sequelize

  const Role = instance.db.define('role', {
    name: {
      type: seq.STRING,
      allowNull: false
    },
    isDefault: {
      type: seq.BOOLEAN
    },
    color: {
      type: seq.INTEGER // TODO: create custom color dataType (const colorValidator = v => /^#([0-9a-f]{3}){1,2}$/i.test(v))
    },
    permissions: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  instance.decorate('Role', Role)

  // const roleSchema = new instance.mongoose.Schema({
  //   name: {
  //     required: true,
  //     unqiue: true,
  //     type: String
  //   },
  //   isDefault: {
  //     type: Boolean
  //   },
  //   color: {
  //     type: String,
  //     validator: [colorValidator, 'Invalid color']
  //   },
  //   permissions: {
  //     type: Number,
  //     required: true
  //   }
  // })

  // const Role = instance.mongoose.connection.model('Role', roleSchema)

  // instance.decorate('Role', Role)
})
