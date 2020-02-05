module.exports = fastify => {
  const seq = fastify.Sequelize

  const test = fastify.db.define('test', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    testing: {
      type: seq.BOOLEAN,
      allowNull: false,
      unique: true
    }
  })

  return test
}
