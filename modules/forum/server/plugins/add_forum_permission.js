const fp = require("fastify-plugin");

module.exports = fp(async (instance) => {
  instance.permissions.addPermission(
    "MANAGE_FORUM",
    "Forum Permissions",
    "Manage Forum",
    "Users with this permission can remove/edit/move/close posts"
  );
});
