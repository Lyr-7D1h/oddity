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

const getIgnoredModule = () => {
  const args = process.argv[2];
  if (args === "client" || args === "c") {
    return "server";
  } else if (args === "server" || args === "s") {
    return "client";
  } else {
    return "";
  }
};

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

/**
 * Start Loading
 */
fs.readdir(MODULES_DIR, (err, filenames) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const ignoreModule = getIgnoredModule();

  const moduleLoaders = [];
  filenames.forEach((filename) => {
    if (
      filename !== "node_modules" &&
      filename !== "package.json" &&
      filename !== "package-lock.json" &&
      filename !== "jsconfig.json"
    )
      moduleLoaders.push(loadModule(filename, ignoreModule));
  });

  // Write all data to the files
  Promise.all(moduleLoaders)
    .then(() => {
      let writeCommands;
      if (ignoreModule === "client") {
        writeCommands = [writeServerFiles()];
      } else if (ignoreModule === "server") {
        writeCommands = [writeClientFiles()];
      } else {
        writeCommands = [writeClientFiles(), writeServerFiles()];
      }

      Promise.all(writeCommands)
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
