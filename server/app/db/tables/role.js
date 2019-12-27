const fp = require('fastify-plugin')

module.exports = async fastify => {
  const seq = fastify.Sequelize

  class Role extends seq.Model {}
  Role.init(
    {
      name: {
        type: seq.TEXT,
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
    },
    { sequelize: fastify.db, modelName: 'role' }
  )

  return Role
}
