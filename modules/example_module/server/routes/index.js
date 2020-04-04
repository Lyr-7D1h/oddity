"use strict";

module.exports = async (fastify) => {
  fastify.get(
    "/example",
    {
      permissions: fastify.PERMISSIONS.NON_SET,
    },
    async (request, reply) => {
      reply.example();
    }
  );
};
