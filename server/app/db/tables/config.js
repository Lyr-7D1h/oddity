// let routeSchema = new instance.mongoose.Schema({
//   name: {
//     required: true,
//     type: String
//   },
//   // Should be unique within document
//   path: {
//     required: true,
//     type: instance.mongoose.Types.EmptyString,
//     lowercase: true
//   },
//   // should only be one default
//   default: {
//     type: Boolean
//   },
//   module: {
//     type: String,
//     lowercase: true,
//     enum: ['servers', 'members', 'forum', 'home']
//   }
// })

module.exports = async fastify => {
  const seq = fastify.Sequelize

  const Config = fastify.db.define('config', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    isActive: {
      type: seq.BOOLEAN,
      allowNull: false
    },
    title: {
      type: seq.STRING,
      allowNull: false
    }
  })

  return Config
}
