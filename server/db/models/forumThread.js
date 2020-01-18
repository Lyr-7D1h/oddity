module.exports = async fastify => {
  const seq = fastify.Sequelize

  const model = fastify.db.define('forumThread', {
    title: {
      type: seq.STRING,
      unique: true,
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
