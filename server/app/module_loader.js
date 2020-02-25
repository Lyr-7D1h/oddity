const fs = require('fs')
const path = require('path')
const glob = require('glob')

const fastifyAutoload = require('fastify-autoload')

const MODULES_DIR = path.join(__dirname, '..', '..', 'modules')

/**
 * Load all files and check if they are okay
 */
module.exports = (fastify, _, done) => {
  fastify.log.debug('==== MODULE LOADER START ====')

  const errHandler = err => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }

  /**
   * update or create module in database
   * @param {string} path
   */
  const loadConfig = configPath => {
    const config = require(configPath)

    const { name, version } = config

    fastify.log.debug('Loading config ', {
      name,
      version
    })

    // make sure path is in the format of /this/is/an/example/path
    const pathCheck = path => {
      path = path.startsWith('/') ? path : '/' + path
      path = path.endsWith('/') ? path.substring(0, path.length - 1) : path
      return path
    }

    return new Promise((resolve, reject) => {
      fastify.models.module
        .upsert({ name, version }, { returning: true })
        .then(([upsertedModule]) => {
          if (config.routes) {
            const moduleRoutesPromises = []
            config.routes.forEach(route => {
              fastify.log.debug(
                `Found Route "${route.path}" for Component "${route.component}"`
              )

              const moduleDir = path.dirname(configPath)
              const componentDir = path.dirname(route.component)

              const fileName = path.basename(route.component)
              const directory = path.join(moduleDir, componentDir)

              // TEST: check if component file exists otherwise give error
              glob(
                `?(${fileName}.js|${fileName}.jsx|${fileName})`,
                { cwd: directory },
                (err, matches) => {
                  errHandler(err)

                  if (matches.length === 1) {
                    route.moduleId = upsertedModule.id

                    pathCheck(route.path)

                    route.component = path.join(
                      path.basename(moduleDir),
                      componentDir,
                      fileName
                    )

                    moduleRoutesPromises.push(
                      fastify.models.moduleRoute.upsert(route)
                    )
                  } else {
                    // check in default /client/components folder in not found in specified componentsPath
                    glob(
                      `?(${fileName}.js|${fileName}.jsx|${fileName})`,
                      {
                        cwd: path.join(moduleDir, 'client', 'components')
                      },
                      (err, matches) => {
                        errHandler(err)
                        if (matches.length === 1) {
                          route.component = path.join(
                            path.basename(moduleDir),
                            'client',
                            'components',
                            fileName
                          )
                          pathCheck(route.path)

                          moduleRoutesPromises.push(
                            fastify.models.moduleRoute.upsert(route)
                          )
                        } else {
                          errHandler(
                            new Error(
                              `Client Routing: "${path.join(
                                directory,
                                fileName
                              )}" not found`
                            )
                          )
                        }
                      }
                    )
                  }
                }
              )
            })
            resolve(moduleRoutesPromises)
          }
        })
        .catch(err => reject(err))
    })
  }

  const loadClient = clientPath => {
    return new Promise((resolve, reject) => {
      fs.readdir(clientPath, (err, clientFiles) => {
        if (err) reject(err)

        const loadComponents = componentsPath => {
          return new Promise((resolve, reject) => {
            // TEST: check if index.jsx exists
            fs.access(path.join(componentsPath, 'index.jsx'), err => {
              if (err) {
                console.error(
                  `${path.join(componentsPath, 'index.jsx')} not found`
                )
                process.exit(1)
                reject(err)
              }
              resolve()
            })
          })
        }

        const clientModuleLoaders = []
        clientFiles.forEach(clientFile => {
          switch (clientFile) {
            case 'components':
              clientModuleLoaders.push(
                loadComponents(path.join(clientPath, clientFile))
              )
              break
            case 'redux':
              break
          }
        })

        resolve(clientModuleLoaders)
      })
    })
  }

  const loadServer = serverPath => {
    return new Promise((resolve, reject) => {
      const loadRoutes = routePath => {
        fastify.log.debug(`Loading Routes ${routePath}`)
        fastify.register(fastifyAutoload, {
          dir: routePath,
          options: Object.assign({
            prefix: '/api'
          })
        })
      }

      const loadPlugins = pluginPath => {
        fastify.log.debug(`Loading Plugin ${pluginPath}`)
        fastify.register(fastifyAutoload, {
          dir: pluginPath,
          options: Object.assign({})
        })
      }

      fs.readdir(serverPath, (err, folders) => {
        if (err) reject(err)

        const serverModuleLoaders = []
        folders.forEach(folder => {
          switch (folder) {
            case 'routes':
              loadRoutes(path.join(serverPath, folder))
              break
            case 'plugins':
              loadPlugins(path.join(serverPath, folder))
              break
            default:
              console.error(`COULD NOT LOAD ${serverPath}/${folder}`)
          }
        })
        resolve(serverModuleLoaders)
      })
    })
  }

  const loadModule = modulePath => {
    return new Promise((resolve, reject) => {
      glob('?(config.js|config.json)', {cwd: modulePath}, (err, matches) => {
        errHandler(err)

        let config = matches[0]
        if (config && matches.length === 1) {
          config = require(path.join(modulePath, config))
          const {name, version} = config 
          fastify.log.info(`Loading module ${name} (${version})`)
          
        } else {
          fastify.log.error(`Config File not found in ${modulepath}`)
        }
      })

      fs.readdir(modulePath, (err, moduleFiles) => {
        if (err) reject(err)

        const srcLoaders = []
        moduleFiles.forEach(moduleFile => {
          const moduleSrcPath = path.join(modulePath, moduleFile)
          switch (moduleFile.toLowerCase()) {
            case 'config.js':
              srcLoaders.push(loadConfig(moduleSrcPath))
              break
            case 'config.json':
              srcLoaders.push(loadConfig(moduleSrcPath))
              break
            case 'client':
              srcLoaders.push(loadClient(moduleSrcPath))
              break
            case 'server':
              srcLoaders.push(loadServer(moduleSrcPath))
              break
            default:
              console.error(`COULD NOT LOAD FILE ${moduleFile}`)
              break
          }
        })
        Promise.all(srcLoaders).then(() => {
          resolve()
        })
      })
    })
  }

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
        fastify.log.debug('==== MODULE LOADER FINISH ====')
        fastify.log.info('Modules loaded')
        done()
      })
      .catch(err => {
        errHandler(err)
      })
  })
}
