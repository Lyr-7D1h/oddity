const path = require("path");
const fs = require("fs");

const clientImportData = {
  modules: {},
};

const loadComponents = require("./load_components");
const loadAdminPage = require("./load_admin_page");
const loadRedux = require("./load_redux");
const loadInit = require("./loadInit");

exports.load = (config, moduleIdentifier) => {
  const clientPath = path.join(MODULES_DIR, moduleIdentifier, "client");

  clientImportData.modules[config.name] = { routes: [] };
  clientImportData.redux = { actions: [], reducers: [] };
  console.log(`${config.name}: Loading Client`);

  const clientLoaders = [];

  if (config.adminPage) {
    clientLoaders.push(
      loadAdminPage(config, moduleIdentifier, clientImportData)
    );
  }

  return new Promise((resolve, reject) => {
    fs.readdir(clientPath, (err, files) => {
      if (err) reject(err);

      files.forEach((file) => {
        switch (file.toLocaleLowerCase()) {
          case "components":
            clientLoaders.push(
              loadComponents(config, moduleIdentifier, clientImportData)
            );
            break;
          case "redux":
            clientLoaders.push(
              loadRedux(config, moduleIdentifier, clientImportData)
            );
            break;
          case "init.js":
            clientLoaders.push(
              loadInit(config, moduleIdentifier, clientImportData)
            );
        }
      });

      Promise.all(clientLoaders)
        .then(() => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  });
};

exports.write = () => {
  const moduleFile = `module.exports = ${JSON.stringify(
    clientImportData.modules
  )}`
    .replace(/("require\()/g, "require(")
    .replace(/\).default"/g, ").default");

  const reduxFile = `module.exports = ${JSON.stringify(clientImportData.redux)}`
    .replace(/("require\()/g, "require(")
    .replace(/\).default"/g, ").default");

  return new Promise((resolve, reject) => {
    fs.access(CLIENT_IMPORT_DIR, (err) => {
      if (err) {
        fs.mkdirSync(CLIENT_IMPORT_DIR);
      }
      Promise.all([
        new Promise((resolve, reject) => {
          fs.writeFile(
            path.join(CLIENT_IMPORT_DIR, "modules.js"),
            moduleFile,
            (err) => {
              if (err) reject(err);
              console.debug(
                "Client: /client/module_loader_imports/modules.js written"
              );

              resolve();
            }
          );
        }),
        new Promise((resolve, reject) => {
          fs.writeFile(
            path.join(CLIENT_IMPORT_DIR, "redux.js"),
            reduxFile,
            (err) => {
              if (err) reject(err);
              console.debug(
                "Client: /client/module_loader_imports/redux.js written"
              );

              resolve();
            }
          );
        }),
      ])
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};
