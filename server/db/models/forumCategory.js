module.exports = async fastify => {
  const seq = fastify.Sequelize

  const forumCategory = fastify.db.define('forumCategory', {
    title: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    order: {
      type: seq.INTEGER,
      allowNull: false,
      unique: true
    }
  })

  return forumCategory
}
