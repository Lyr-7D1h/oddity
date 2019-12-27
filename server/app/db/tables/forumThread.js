module.exports = async fastify => {
  const seq = fastify.Sequelize

  const model = fastify.db.define('forumThread', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    categoryId: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  return model
}
