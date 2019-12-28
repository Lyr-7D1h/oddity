module.exports = async fastify => {
  const seq = fastify.Sequelize

  const model = fastify.db.define('forumThread', {
    name: {
      type: seq.STRING,
      allowNull: false
    },
    order: {
      type: seq.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  return model
}
