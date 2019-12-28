'use strict'

module.exports = async fastify => {
  const columns = '-password -ip -email'
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
      // {
      //   method: 'post',
      //   auth: [fastify.verify.cookie, fastify.verify.basic.portal]
      // },
      // {
      //   method: 'delete',
      //   auth: fastify.verify.cookie
      // },
      // {
      //   method: 'put',
      //   auth: fastify.verify.cookie
      // }
    ]
  }
  fastify.routeGen(userRoute)
}
