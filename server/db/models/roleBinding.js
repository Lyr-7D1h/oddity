module.exports = (sequelize, DataTypes) => {
  const roleBinding = sequelize.define('role', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
  roleBinding.associate = (models) => {
    roleBinding.belongsTo(models.user)
    roleBinding.hasOne(models.role)
  }
  return roleBinding
}
