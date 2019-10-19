"use strict";

// Read the .env file.
require("dotenv").config();

// installs an 'unhandledRejection' handler
require("make-promises-safe");

// Require the framework
const Fastify = require("fastify");

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    prettyPrint: true
  }
});

server.register(require("./app.js"));

server.listen(process.env.PORT || 3000, err => {
  server.log.info("Routes:");
  console.debug(server.printRoutes());
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
