"use strict";

module.exports = async function(fastify, opts) {
  fastify.get("/example", async function(request, reply) {
    return fastify.someSupport();
  });
};
