module.exports = async fastify => {
  const seq = fastify.Sequelize

  const Portal = fastify.db.define('portal', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    url: {
      type: seq.STRING,
      isUrl: true
    },
    accessKey: {
      type: seq.STRING,
      allowNull: false,
      unique: true,
      len: [8, 30]
    },
    secretKey: {
      type: seq.STRING,
      allowNull: false,
      unique: true,
      len: [30, 80]
    }
  })

  return Portal
}
