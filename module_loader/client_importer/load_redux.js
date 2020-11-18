const path = require("path");
const fs = require("fs");
const getJsFiles = require("../get_js_files");

/**
 * Can either be two files
 *
 * {name}Actions.js
 * {name}Reducer.js
 *
 * or two directories
 *
 * /actions
 * /reducers
 */
module.exports = (config, moduleIdentifier, clientImportData) => {
  const reduxPath = path.join(MODULES_DIR, moduleIdentifier, "client", "redux");

  const getReduxStateNaming = (file) => {
    return file.replace(/Actions|Reducer|js|\./gm, "");
  };

  const loadDirectory = (directory, reduxSub) => {
    return new Promise((resolve, reject) => {
      getJsFiles(directory).then((files) => {
        const loaders = [];
        files.forEach((file) => {
          loaders.push(
            clientImportData.redux[reduxSub].push([
              getReduxStateNaming(file),
              path.join(directory, file),
            ])
          );
        });

        Promise.all(loaders)
          .then(() => resolve())
          .catch((err) => reject(err));
      });
    });
  };

  const loadFile = (file) => {
    return new Promise((resolve, reject) => {
      fs.stat(path.join(reduxPath, file), (err, stats) => {
        if (err) reject(err);

        if (stats.isDirectory()) {
          switch (file) {
            case "reducers":
              loadDirectory(path.join(reduxPath, "reducers"), "reducers")
                .then(() => {
                  resolve();
                })
                .catch((err) => reject(err));
              break;
            case "actions":
              // Currently not used might be usefull in the future
              loadDirectory(path.join(reduxPath, "actions"), "actions")
                .then(() => {
                  resolve();
                })
                .catch((err) => reject(err));
              break;
          }
        } else if (file.endsWith("Actions.js")) {
          // Currently not used might be usefull in the future
          clientImportData.redux.actions.push([
            getReduxStateNaming(file),
            `require('${path.join(reduxPath, file)}').default`,
          ]);
          resolve();
        } else if (file.endsWith("Reducer.js")) {
          clientImportData.redux.reducers.push([
            getReduxStateNaming(file),
            `require('${path.join(reduxPath, file)}').default`,
          ]);
          resolve();
        } else {
          resolve();
        }
      });
    });
  };

  return new Promise((resolve, reject) => {
    console.debug(`${config.name}: Loading Redux`);

    fs.readdir(reduxPath, (err, files) => {
      if (err) reject(err);
      const loaders = [];

      files.forEach((file) => {
        loaders.push(loadFile(file));
      });

      Promise.all(loaders)
        .then(() => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  });
};
