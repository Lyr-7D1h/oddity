'use strict'

/**
 * Reads files in /modules =>
 *  (Should validate files)
 *  Writes db files in /modules to their corresponding place in /server
 *  Creates client import file
 *  Creates server import file
 */

const fs = require('fs')
const path = require('path')
const loadModule = require('./load_module')
const writeServer = require('./server_importer').write
const writeClient = require('./client_importer').write
const writeDbFiles = require('./write_db_files')

require('dotenv').config()

const MODULES_DIR = path.join(__dirname, '..', '..', 'modules')

console.debug('==== MODULE LOADER START ====')

const errHandler = err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

/**
 * Start Loading
 */
fs.readdir(MODULES_DIR, (err, moduleDirs) => {
  errHandler(err)

  const moduleLoaders = []

  moduleDirs.forEach(moduleDir => {
    if (
      moduleDir !== 'node_modules' &&
      moduleDir !== 'package.json' &&
      moduleDir !== 'package-lock.json'
    )
      moduleLoaders.push(loadModule(path.join(MODULES_DIR, moduleDir)))
  })

  Promise.all(moduleLoaders)
    .then(() => {
      Promise.all([writeServer(), writeClient(), writeDbFiles()])
        .then(() => {
          writeDbFiles()
            .then(() => {
              console.debug('==== MODULE LOADER END ====')
            })
            .catch(err => {
              console.error(err)
              process.exit(1)
            })
        })
        .catch(err => {
          console.error(err)
          process.exit(1)
        })
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})
