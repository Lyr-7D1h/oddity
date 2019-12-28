// const commentSchema = new instance.mongoose.Schema({
//   author: {
//     type: instance.mongoose.Types.ObjectId,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true,
//     min: 3,
//     max: 1000
//   }
// })

module.exports = async fastify => {
  const seq = fastify.Sequelize

  const forumPost = fastify.db.define('forumPost', {
    title: {
      type: seq.STRING,
      allowNull: false,
      unique: true,
      len: [3, 40]
    },
    content: {
      type: seq.TEXT,
      allowNull: false,
      len: [3, 5000]
    },
    authorId: {
      type: seq.INTEGER,
      allowNull: false
    },
    threadId: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  return forumPost
}
