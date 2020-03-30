module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN
    },
    color: {
      type: DataTypes.INTEGER // TODO: create custom color dataType (const colorValidator = v => /^#([0-9a-f]{3}){1,2}$/i.test(v))
    },
    permissions: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  role.associate = models => {}
  return role
}
