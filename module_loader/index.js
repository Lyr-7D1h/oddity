"use strict";

/**
 * Reads files in /modules =>
 *  (Should validate files)
 *  Creates client import files
 *  Creates server import files
 */

const fs = require("fs");
const path = require("path");
const loadModule = require("./load_module");
const writeServerFiles = require("./server_importer").write;
const writeClientFiles = require("./client_importer").write;

global.MODULES_DIR = path.join(__dirname, "..", "modules");
global.CLIENT_IMPORT_DIR = path.join(
  __dirname,
  "../client/module_loader_imports"
);
global.SERVER_IMPORT_DIR = path.join(
  __dirname,
  "../server/module_loader_imports"
);

console.debug("==== MODULE LOADER START ====");

const errHandler = (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
};

/**
 * Start Loading
 */
fs.readdir(MODULES_DIR, (err, filenames) => {
  errHandler(err);

  const moduleLoaders = [];

  filenames.forEach((filename) => {
    if (
      filename !== "node_modules" &&
      filename !== "package.json" &&
      filename !== "package-lock.json" &&
      filename !== "jsconfig.json"
    )
      moduleLoaders.push(loadModule(filename));
  });

  // Write all data to the files
  Promise.all(moduleLoaders)
    .then(() => {
      Promise.all([writeServerFiles(), writeClientFiles()])
        .then(() => {
          console.debug("==== MODULE LOADER END ====");
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});
