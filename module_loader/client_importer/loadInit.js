const path = require("path");

module.exports = (config, moduleIdentifier, clientImportData) => {
  const initPath = path.join(MODULES_DIR, moduleIdentifier, "client/init.js");
  clientImportData.modules[config.name].init = `require('${initPath}').default`;
};
