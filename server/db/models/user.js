module.exports = async fastify => {
  const seq = fastify.Sequelize

  const User = fastify.db.define('user', {
    username: {
      type: seq.STRING,
      allowNull: false,
      unique: true,
      len: [3, 30]
    },
    identifier: {
      type: seq.STRING,
      allowNull: true,
      unique: true,
      len: [3, 30],
      isLowercase: true
    },
    password: {
      type: seq.STRING,
      allowNull: false,
      len: [3, 30]
    },
    email: {
      type: seq.STRING,
      allowNull: false,
      unique: true,
      isLowercase: true
    },
    avatar: {
      type: seq.STRING,
      unique: true
    },
    ip: {
      type: seq.STRING,
      allowNull: false,
      isLowercase: true,
      isIP: true
    },
    permissions: {
      type: seq.INTEGER
    },
    roleId: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  return User
}
