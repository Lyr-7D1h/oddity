const path = require("path");
const fs = require("fs");

module.exports = (moduleIdentifier, serverImportData) => {
  const migrationsPath = path.join(
    MODULES_DIR,
    moduleIdentifier,
    "server/migrations"
  );
  return new Promise((resolve, reject) => {
    fs.readdir(migrationsPath, (err, matches) => {
      if (err) reject(err);

      matches.forEach((match) => {
        serverImportData.migrations.push(path.join(migrationsPath, match));
      });
      resolve();
    });
  });
};
