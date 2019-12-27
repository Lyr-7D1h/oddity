module.exports = async fastify => {
  const seq = fastify.Sequelize

  const forumCategory = fastify.db.define('forumCategory', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    }
  })

  return forumCategory
}
