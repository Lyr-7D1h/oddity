"use strict";

module.exports = async (fastify) => {
  fastify.get(
    "/example",
    {
      permissions: fastify.PERMISSIONS.PUBLIC,
    },
    async (request, reply) => {
      reply.example();
    }
  );
};
