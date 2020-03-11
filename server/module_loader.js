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
    return new Promise((resolve, reject) => {})
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
              serverImportData.modules.push(name)
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
      let clientFile = `module.exports = ${JSON.stringify(clientImportData)}`
        .replace('"require(', 'require(')
        .replace(').default"', ').default')

      // Write client import file
      fs.writeFile(clientImportPath, clientFile, err => {
        errHandler(err)

        // write server import file
        fs.writeFile(
          serverImportPath,
          `module.exports = ${JSON.stringify(serverImportData)}`,
          err => {
            errHandler(err)
            console.debug('==== MODULE LOADER FINISH ====')
            process.exit(0)
          }
        )
      })
    })
    .catch(err => {
      errHandler(err)
    })
})
// })
