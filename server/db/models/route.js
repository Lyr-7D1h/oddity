module.exports = (sequelize, DataTypes) => {
  const route = sequelize.define('route', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // TODO: Should be unique within foreach configId
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    configId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  route.associate = models => {
    route.belongsTo(models.config)
  }

  return route
}
