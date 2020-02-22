"use strict";

module.exports = async fastify => {
  fastify.get("/example", async (request, reply) => {
    reply.example();
  });
};
