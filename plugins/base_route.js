"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function(instance) {
  instance.decorate("baseRoute", async (fastify, opts, { endpoint }) => {
    fastify.get(`/${endpoint}`, async function(request, reply) {
      return "get all";
    });

    fastify.get(`/${endpoint}/:id`, async function(request, reply) {
      return "get";
    });
  });
});
