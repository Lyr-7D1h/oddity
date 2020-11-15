const path = require("path");
const fs = require("fs");

module.exports = (moduleIdentifier, serverImportData) => {
  const modelsPath = path.join(MODULES_DIR, moduleIdentifier, "server/models");
  return new Promise((resolve, reject) => {
    fs.readdir(modelsPath, (err, matches) => {
      if (err) reject(err);

      matches.forEach((match) => {
        serverImportData.models.push(path.join(modelsPath, match));
      });
      resolve();
    });
  });
};
