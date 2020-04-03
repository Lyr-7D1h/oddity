const fp = require("fastify-plugin");

module.exports = fp(instance => {
  instance.permissions.addPermission("MANAGE_FORUM");
});
