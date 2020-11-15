const path = require("path");
const fs = require("fs");

const serverImportData = {
  modules: [],
  routeDirs: [],
  pluginDirs: [],
  seeders: [],
  models: [],
  migrations: [],
};

const load = (_config, moduleIdentifier) => {
  const serverPath = path.join(MODULES_DIR, moduleIdentifier, "server");

  const loadPlugins = () => {
    serverImportData.pluginDirs.push(path.join(serverPath, "plugins"));
  };

  const loadRoutes = () => {
    serverImportData.routeDirs.push(path.join(serverPath, "routes"));
  };

  const loadDbFiles = (key) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(serverPath, key), (err, matches) => {
        if (err) reject(err);

        matches.forEach((match) => {
          serverImportData[key].push(
            `require('${path.join(serverPath, key, match)}')`
          );
        });
        resolve();
      });
    });
  };

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(serverPath), (err, matches) => {
      if (err) reject(err);

      const serverLoaders = [];
      matches.forEach((match) => {
        switch (match) {
          case "routes":
            loadRoutes();
            break;
          case "plugins":
            loadPlugins();
            break;
          case "models":
            serverLoaders.push(loadDbFiles("models"));
            break;
          case "migrations":
            serverLoaders.push(loadDbFiles("migrations"));
            break;
          case "seeders":
            serverLoaders.push(loadDbFiles("seeders"));
            break;
        }
      });

      Promise.all(serverLoaders)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};

/**
 * Write module_loader_imports.js
 */
const write = () => {
  return new Promise((resolve, reject) => {
    const serverFile = `module.exports = ${JSON.stringify(serverImportData)}`
      .replace(/("require\()/g, "require(")
      .replace(/\)"/g, ")");

    // write server import file
    const write = () =>
      fs.writeFile(
        path.join(SERVER_IMPORT_DIR, "index.js"),
        serverFile,
        (err) => {
          if (err) reject(err);

          resolve();
        }
      );

    fs.access(SERVER_IMPORT_DIR, (err) => {
      if (err) {
        fs.mkdir(SERVER_IMPORT_DIR, () => {
          write();
        });
      } else {
        write();
      }
    });
  });
};

/**
 * Add all modules
 * @param {string} name
 * @param {string} version
 */
const addModule = (name, version, identifier) => {
  serverImportData.modules.push({
    name,
    version,
    identifier,
    route: name.toLowerCase(),
  });
};

module.exports = { load, write, addModule };
