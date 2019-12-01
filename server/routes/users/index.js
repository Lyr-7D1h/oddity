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
        method: 'post',
        columns: columns
      },
      {
        method: 'delete',
        columns: columns
      },
      {
        method: 'put',
        columns: columns
      }
    ]
  }
  fastify.routeGen(userRoute)

  // fastify.baseRoute(fastify, opts, {
  //   Model: fastify.User,
  //   columns: '-password -ip -email',
  //   excludeMethods: 'create'
  // })
}
