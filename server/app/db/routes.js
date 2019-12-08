const fp = require('fastify-plugin')

module.exports = fp(async instance => {
  // let routeSchema = new instance.mongoose.Schema({
  //   configId: {
  //     required: true,
  //     type: instance.mongoose.Types.ObjectId
  //   },
  //   name: {
  //     required: true,
  //     type: String
  //   },
  //   route: {
  //     required: true,
  //     unique: true,
  //     type: instance.mongoose.Types.EmptyString,
  //     lowercase: true
  //   },
  //   default: {
  //     type: Boolean
  //   },
  //   module: {
  //     type: String,
  //     lowercase: true
  //   }
  // })
  // routeSchema.index(
  //   { default: 1 },
  //   { unique: true, partialFilterExpression: { default: true } }
  // )
  // const Route = instance.mongoose.connection.model('Route', routeSchema)
  // instance.decorate('Route', Route)
})
