"use strict";

module.exports = async (fastify, opts) => {
  const userSchema = require("./schema")(fastify.mongoose.Schema);
  fastify.baseRoute(fastify, opts, {
    Model: fastify.mongoose.connection.model("User", userSchema)
  });
};
