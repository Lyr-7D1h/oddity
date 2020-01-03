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

  const Route = fastify.db.define('route', {
    name: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    // TODO: Should be unique within foreach categoryId
    path: {
      type: seq.STRING,
      allowNull: false,
      unique: true
    },
    default: {
      type: seq.BOOLEAN,
      allowNull: false
    },
    module: {
      type: seq.ENUM('servers', 'members', 'forum', 'home'),
      allowNull: false,
      isLowerCase: true
    },
    configId: {
      type: seq.INTEGER,
      allowNull: false
    }
  })

  return Route
}
