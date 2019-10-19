"use strict";

module.exports = async function(fastify, opts) {
  fastify.get("/example/test", async function(request, reply) {
    return "test";
  });
};
