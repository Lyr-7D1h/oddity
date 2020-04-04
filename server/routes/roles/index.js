'use strict'

module.exports = async (fastify) => {
  const roleRoute = {
    model: fastify.models.role,
    routes: [
      {
        method: 'get',
        multiple: true,
        permissions: fastify.PERMISSIONS.NON_SET,
      },
      {
        method: 'get',
        permissions: fastify.PERMISSIONS.NON_SET,
      },
      {
        method: 'post',
        preHandler: fastify.authentication.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
      {
        method: 'delete',
        preHandler: fastify.authentication.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
      {
        method: 'patch',
        preHandler: fastify.authentication.cookie,
        permissions: [
          fastify.PERMISSIONS.ROOT,
          fastify.PERMISSIONS.MANAGE_ROLES,
        ],
      },
    ],
  }
  fastify.routeGen(roleRoute)
}
