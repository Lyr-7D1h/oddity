const glob = require("glob");
const path = require("path");
const fs = require("fs");

const loadClient = require("./client_importer").load;
const { load: loadServer, addModule } = require("./server_importer");

/**
 * Load module and validate config
 */
module.exports = (moduleIdentifier, ignoreModule) => {
  const modulePath = path.join(MODULES_DIR, moduleIdentifier);
  return new Promise((resolve, reject) => {
    glob("?(config.js|config.json)", { cwd: modulePath }, (err, matches) => {
      if (err) reject(err);

      let configFilename = matches[0];

      if (!configFilename || configFilename.length === 0) {
        reject(new Error(`Config File not found in ${modulePath}`));
      }

      let config;
      try {
        config = require(path.join(modulePath, configFilename));
      } catch (err) {
        reject(
          Error(`Could not read: ${path.join(modulePath, configFilename)}`)
        );
      }

      // Fetch config
      const { name, version } = config;

      if (!name || !version) {
        reject(
          Error(
            `No name or version in ${path.join(modulePath, configFilename)}`
          )
        );
      }

      console.debug(
        `Loading module ${name} [${moduleIdentifier}]\t(${version})`
      );

      // server import hook so you can add all modules
      addModule(name, version, moduleIdentifier);

      const srcLoaders = [];
      // Load Module Directory
      fs.readdir(modulePath, (err, moduleFiles) => {
        if (err) reject(err);

        moduleFiles.forEach((moduleFile) => {
          moduleFile = moduleFile.toLowerCase();
          if (moduleFile === "config.js" || moduleFile === "config.json") {
            // do nothing if config file
          } else if (moduleFile === "client" && ignoreModule !== "client") {
            srcLoaders.push(loadClient(config, moduleIdentifier));
          } else if (moduleFile === "server" && ignoreModule !== "server") {
            srcLoaders.push(loadServer(config, moduleIdentifier));
          } else {
            console.warn(`Ignoring: ${path.join(modulePath, moduleFile)}`);
          }
        });

        Promise.all(srcLoaders)
          .then(() => {
            resolve();
          })
          .catch((err) => reject(err));
      });
    });
  });
};
