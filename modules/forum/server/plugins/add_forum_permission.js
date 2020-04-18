const fp = require("fastify-plugin");

module.exports = fp(async (instance) => {
  instance.permissions.addPermission("MANAGE_FORUM");
});
