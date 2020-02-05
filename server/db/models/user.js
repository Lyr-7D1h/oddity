module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: [3, 30]
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      len: [3, 30],
      isLowercase: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [3, 30]
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isLowercase: true
    },
    avatar: {
      type: DataTypes.STRING,
      unique: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
      isIP: true
    },
    permissions: {
      type: DataTypes.INTEGER
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  user.associate = models => {
    user.hasMany(models.forumPost, {
      as: 'posts',
      foreignKey: 'authorId'
    })
    user.belongsTo(models.role)
  }
  return user
}
