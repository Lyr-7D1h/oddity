'use strict'

/**
 * Reads files in /modules =>
 *  (Should validate files)
 *  Upserts module in database
 *  Creates client import file
 *  Creates server import file
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

require('dotenv').config()

const MODULES_DIR = path.join(__dirname, '..', 'modules')

const clientImportPath = path.join(
  __dirname,
  '..',
  'client',
  'module_loader_imports.js'
)
const clientImportData = {
  routes: {}
}

const serverImportPath = path.join(__dirname, 'module_loader_imports.js')
const serverImportData = {
  modules: []
}

const dbFiles = {
  seeders: [],
  models: [],
  migrations: []
}

/**
 * Load all files and check if they are okay
 */

console.debug('==== MODULE LOADER START ====')

const errHandler = err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

const loadDbFiles = () => {
  const syncFiles = (sources, destination) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(__dirname, destination), (err, existingFiles) => {
        if (err) reject(err)

        const loaders = []
        if (existingFiles) {
          existingFiles = existingFiles.filter(file =>
            file.startsWith('.imported_')
          )

          // Remove file if it does not exist in sources
          existingFiles.forEach(existingFile => {
            const sourcesFilesList = sources.map(file => path.basename(file))
            existingFile = existingFile.replace('.imported_', '')
            if (sourcesFilesList.indexOf(existingFile) === -1) {
              loaders.push(
                new Promise((resolve, reject) => {
                  fs.unlink(
                    path.join(destination, '.imported_' + existingFile),
                    err => {
                      if (err) reject(err)
                      resolve()
                    }
                  )
                })
              )
            }
          })
        }

        sources.forEach(source => {
          loaders.push(
            new Promise(resolve => {
              fs.copyFile(
                source,
                path.join(destination, '.imported_' + path.basename(source)),
                fs.constants.COPYFILE_FICLONE,
                () => {
                  resolve()
                }
              )
            })
          )
        })

        resolve(loaders)
      })
    })
  }

  return Promise.all([
    syncFiles(dbFiles.seeders, './db/seeders'),
    syncFiles(dbFiles.models, './db/models'),
    syncFiles(dbFiles.migrations, './db/migrations')
  ])
}

// Only loads components
const loadClient = (config, modulePath) => {
  return new Promise((resolve, reject) => {
    /**
     * Returns string with imports of components
     */
    const loadComponents = () => {
      return new Promise((resolve, reject) => {
        clientImportData.routes[config.name] = []
        /**
         *  Check if /client/component/index.js or /client/component/index.jsx exists and then adds it
         *  */
        const addBaseComponent = () => {
          return new Promise((resolve, reject) => {
            const componentPath = path.join(modulePath, 'client', 'components')
            glob(
              '?(index.js|index.jsx)',
              { cwd: componentPath },
              (err, matches) => {
                if (err) reject(err)

                if (matches.length === 1) {
                  clientImportData.routes[config.name].push({
                    path: '/',
                    component: `require('${path.join(
                      '../modules',
                      path.basename(modulePath),
                      'client',
                      'components',
                      matches[0]
                    )}').default`
                  })
                  resolve(true)
                } else {
                  resolve(false)
                }
              }
            )
          })
        }

        if (config.routes) {
          let hasBasePath = false

          const routesPromises = []
          // Read defined routes if no "/" or "" defined use /client/components
          config.routes.forEach(route => {
            if (route.path === '' || route.path === '/') {
              hasBasePath = true
            }

            const filename = path.basename(route.component).split('.')[0]
            const componentPath = path.join(
              modulePath,
              path.dirname(route.component)
            )

            routesPromises.push(
              new Promise((resolve, reject) => {
                // check if component exists
                glob(
                  `?(${filename}.js|${filename}.jsx)`,
                  { cwd: componentPath },
                  (err, matches) => {
                    if (err) reject(err)

                    if (matches.length === 1) {
                      clientImportData.routes[config.name].push({
                        path: route.path,
                        component: `require('${path.join(
                          '../modules',
                          path.basename(modulePath),
                          route.component
                        )}').default`
                      })
                      resolve()
                    } else {
                      reject(new Error(`Component ${componentPath} not found`))
                    }
                  }
                )
              })
            )
          })
          Promise.all(routesPromises)
            .then(modules => {
              if (!hasBasePath) {
                addBaseComponent()
                  .then(() => {
                    resolve(modules)
                  })
                  .catch(err => reject(err))
              } else {
                resolve(modules)
              }
            })
            .catch(err => reject(err))
        } else {
          // Read /client/components
          addBaseComponent()
            .then(created => {
              if (created) {
                resolve()
              } else {
                console.debug(`No clientside routes found for ${config.name}`)
              }
            })
            .catch(err => reject(err))
        }
      })
    }

    const clientLoaders = [
      new Promise((resolve, reject) => {
        fs.access(path.join(modulePath, 'client', 'components'), err => {
          if (!err)
            loadComponents().then(() => {
              resolve()
            })
        })
      })
    ]

    Promise.all(clientLoaders)
      .then(() => {
        resolve()
      })
      .catch(err => reject(err))
  })
}

const loadServer = (config, modulePath) => {
  const loadRoutes = () => {
    return new Promise((resolve, reject) => {
      // serverImportData.routes = [require(path.join(modulePath, 'routes'))]
    })
  }

  const pushDbFile = dbFolder => {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(modulePath, 'server', dbFolder), (err, matches) => {
        if (err) reject(err)

        matches = matches.map(match =>
          path.join(modulePath, 'server', dbFolder, match)
        )
        dbFiles[dbFolder] = dbFiles[dbFolder].concat(matches)
        resolve()
      })
    })
  }

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(modulePath, 'server'), (err, matches) => {
      if (err) reject(err)

      const serverLoaders = []
      matches.forEach(match => {
        switch (match) {
          case 'routes':
            loadRoutes()
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

const loadModule = modulePath => {
  return new Promise((resolve, reject) => {
    glob('?(config.js|config.json)', { cwd: modulePath }, (err, matches) => {
      errHandler(err)

      let config = matches[0]
      if (config && matches.length === 1) {
        // Fetch config
        config = require(path.join(modulePath, config))
        const { name, version } = config

        console.log(`Loading module ${name} (${version})`)

        const srcLoaders = []
        // Load Module Directory
        fs.readdir(modulePath, (err, moduleFiles) => {
          if (err) reject(err)

          moduleFiles.forEach(moduleFile => {
            switch (moduleFile.toLowerCase()) {
              case 'config.js':
                break
              case 'config.json':
                break
              case 'client':
                srcLoaders.push(loadClient(config, modulePath))
                break
              case 'server':
                srcLoaders.push(loadServer(config, modulePath))
                break
              default:
                console.error(`COULD NOT LOAD FILE ${moduleFile}`)
                break
            }
          })
          Promise.all(srcLoaders)
            .then(() => {
              serverImportData.modules.push(config)
              resolve(true)
            })
            .catch(err => reject(err))
        })
      } else {
        reject(new Error(`Config File not found in ${modulePath}`))
      }
    })
  })
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
      console.log(JSON.stringify(clientImportData))
      let clientFile = `module.exports = ${JSON.stringify(clientImportData)}`
        .replace(/("require\()/g, 'require(')
        .replace(/\).default"/g, ').default')

      // Write client import file
      fs.writeFile(clientImportPath, clientFile, err => {
        errHandler(err)

        // write server import file
        fs.writeFile(
          serverImportPath,
          `module.exports = ${JSON.stringify(serverImportData)}`,
          err => {
            errHandler(err)

            // Syncronize DB Files
            loadDbFiles()
              .then(() => {
                console.debug('==== MODULE LOADER FINISH ====')
                process.exit(0)
              })
              .catch(err => {
                errHandler(err)
              })
          }
        )
      })
    })
    .catch(err => {
      errHandler(err)
    })
})
// })
