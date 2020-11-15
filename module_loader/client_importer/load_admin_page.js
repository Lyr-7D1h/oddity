const path = require("path");

const checkFile = require("./check_component_file");

module.exports = (config, moduleIdentifier, clientImportData) => {
  return new Promise((resolve, reject) => {
    if (config.adminPage.includes("/")) {
      const adminPagePath = path.join(
        MODULES_DIR,
        moduleIdentifier,
        config.adminPage
      );
      // console.log(moduleIdentifier);

      checkFile(adminPagePath)
        .then((found) => {
          if (found) {
            clientImportData.modules[
              config.name
            ].adminPage = `require('${adminPagePath}').default`;
            resolve();
          } else {
            throw new Error(`Could not find Admin Page: ${adminPagePath}`);
          }
        })
        .catch((err) => reject(err));
    } else {
      const adminPagePath = path.join(
        MODULES_DIR,
        moduleIdentifier,
        "client",
        "components"
      );
      checkFile(adminPagePath)
        .then((found) => {
          if (found) {
            clientImportData.modules[
              config.name
            ].adminPage = `require('${adminPagePath}').default`;
            resolve();
          } else {
            reject(new Error(`Could not find Admin Page: ${adminPagePath}`));
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
