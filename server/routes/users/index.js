'use strict'

module.exports = async fastify => {
  require('./identifier')(fastify)

  const columns = {
    exclude: [
      'password',
      'ip',
      'email',
      'createdAt',
      'updatedAt',
      'permissions'
    ]
  }

  const userRoute = {
    model: fastify.models.user,
    routes: [
      {
        method: 'get',
        multiple: true,
        columns: columns
      },
      {
        method: 'get',
        columns: columns
      }
    ]
  }
  fastify.routeGen(userRoute)
}
