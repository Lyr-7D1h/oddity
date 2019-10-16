"use strict";
// import baseRoute from "../../plugins/base_route";

module.exports = async function(fastify, opts) {
  fastify.baseRoute(fastify, opts, {
    endpoint: "users"
  });
};
