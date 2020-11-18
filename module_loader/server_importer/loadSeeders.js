const path = require("path");
const fs = require("fs");

module.exports = (moduleIdentifier, serverImportData) => {
  const seedersPath = path.join(
    MODULES_DIR,
    moduleIdentifier,
    "server/seeders"
  );
  return new Promise((resolve, reject) => {
    fs.readdir(seedersPath, (err, matches) => {
      if (err) reject(err);

      matches.forEach((match) => {
        serverImportData.seeders.push(path.join(seedersPath, match));
      });
      resolve();
    });
  });
};
