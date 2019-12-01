'use strict'

module.exports = async fastify => {
  const columns = '-password -ip -email'
  const userRoute = {
    model: fastify.User,
    routes: [
      {
        method: 'get',
        multiple: true,
        columns: columns
      },
      {
        method: 'get',
        columns: columns
      },
      {
        method: 'post'
      },
      {
        method: 'delete'
      },
      {
        method: 'put'
      }
    ]
  }
  fastify.routeGen(userRoute)
}
