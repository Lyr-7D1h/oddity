const path = require('path')
const fs = require('fs')

// TODO: Add plugin directories

const serverImportPath = path.join(
  __dirname,
  '..',
  '..',
  'module_loader_imports.js'
)
const serverImportData = {
  modules: [],
  routeDirs: [],
  pluginDirs: [],
}
const databaseFiles = {
  seeders: [],
  models: [],
  migrations: [],
}

const load = (config, modulePath) => {
  const loadPlugins = () => {
    serverImportData.pluginDirs.push(path.join(modulePath, 'server', 'plugins'))
  }

  const loadRoutes = () => {
    serverImportData.routeDirs.push(path.join(modulePath, 'server', 'routes'))
  }

  const pushDbFile = (dbFolder) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(modulePath, 'server', dbFolder), (err, matches) => {
        if (err) reject(err)

        matches = matches.map((match) =>
          path.join(modulePath, 'server', dbFolder, match)
        )
        databaseFiles[dbFolder] = databaseFiles[dbFolder].concat(matches)
        resolve()
      })
    })
  }

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(modulePath, 'server'), (err, matches) => {
      if (err) reject(err)

      const serverLoaders = []
      matches.forEach((match) => {
        switch (match) {
          case 'routes':
            loadRoutes()
            break
          case 'plugins':
            loadPlugins()
            break
          case 'models':
            serverLoaders.push(pushDbFile('models'))
            break
          case 'migrations':
            serverLoaders.push(pushDbFile('migrations'))
            break
          case 'seeders':
            serverLoaders.push(pushDbFile('seeders'))
            break
        }
      })

      resolve(serverLoaders)
    })
  })
}

/**
 * Write module_loader_imports.js
 */
const write = () => {
  return new Promise((resolve, reject) => {
    const serverFile = `module.exports = ${JSON.stringify(serverImportData)}`
    // write server import file
    fs.writeFile(serverImportPath, serverFile, (err) => {
      if (err) reject(err)

      resolve()
    })
  })
}

const getDatabaseFiles = () => {
  return databaseFiles
}

/**
 *
 * @param {string} name
 * @param {string} version
 */
const addModule = (name, version) => {
  serverImportData.modules.push({
    name,
    version,
  })
}

module.exports = { load, write, getDatabaseFiles, addModule }
