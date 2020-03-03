const fs = require('fs')
const path = require('path')
const glob = require('glob')

const fastifyAutoload = require('fastify-autoload')

const MODULES_DIR = path.join(__dirname, '..', '..', 'modules')
const moduleComponentsData = []
const modulesLoaded = []

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

  const removeUnusedModules = () => {
    return new Promise((resolve, reject) => {
      fastify.db
        .query('DELETE FROM modules WHERE NOT name IN (?)', {
          replacements: [modulesLoaded]
        })
        .then(res => {
          if (res[1].rowCount)
            fastify.log.debug(`Remove ${res[1].rowCount} old modules`)
          resolve()
        })
        .catch(err => reject(err))
    })
  }

  // Only loads components
  const loadClient = (config, modulePath) => {
    return new Promise((resolve, reject) => {
      // check if components folder exists
      fs.access(path.join(modulePath, 'client', 'components'), err => {
        if (err) reject(err)

        /**
         *  Check if /client/component/index.js or /client/component/index.jsx exists and then adds it
         *
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
                  resolve([
                    true,
                    `\t\t{\n\t\t\tpath: "/",\n\t\t\tcomponent: require("${path.join(
                      '../../modules',
                      path.basename(modulePath),
                      'client',
                      'components',
                      matches[0]
                    )}").default\n\t\t},\n`
                  ])
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
                      resolve(
                        `\t\t{\n\t\t\tpath: "${
                          route.path
                        }",\n\t\t\tcomponent: require("${path.join(
                          '../../modules',
                          path.basename(modulePath),
                          route.component
                        )}").default\n\t\t}\n`
                      )
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
                  .then(([_, indexModule]) => {
                    modules.push(indexModule)
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
            .then(([created, indexModule]) => {
              if (created) {
                resolve([indexModule])
              } else {
                fastify.log.debug(
                  `No clientside routes found for ${config.name}`
                )
              }
            })
            .catch(err => reject(err))
        }
      })
    })
  }

  const loadServer = (_, serverPath) => {
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
      glob('?(config.js|config.json)', { cwd: modulePath }, (err, matches) => {
        errHandler(err)

        let config = matches[0]
        if (config && matches.length === 1) {
          config = require(path.join(modulePath, config))
          const { name, version } = config
          fastify.log.info(`Loading module ${name} (${version})`)

          // Load Module Directory
          fs.readdir(modulePath, (err, moduleFiles) => {
            if (err) reject(err)

            const srcLoaders = [
              fastify.models.module.upsert({
                name,
                version
              })
            ]
            moduleFiles.forEach(moduleFile => {
              const moduleSrcPath = path.join(modulePath, moduleFile)
              switch (moduleFile.toLowerCase()) {
                case 'config.js':
                  break
                case 'config.json':
                  break
                case 'client':
                  srcLoaders.push(
                    new Promise((resolve, reject) => {
                      loadClient(config, modulePath)
                        .then(modules => {
                          moduleComponentsData.push(
                            `\t"${name}": [\n${modules.join(',')}\t]\n`
                          )
                          resolve(true)
                        })
                        .catch(err => reject(err))
                    })
                  )
                  break
                case 'server':
                  srcLoaders.push(loadServer(config, moduleSrcPath))
                  break
                default:
                  console.error(`COULD NOT LOAD FILE ${moduleFile}`)
                  break
              }
            })
            Promise.all(srcLoaders)
              .then(() => {
                modulesLoaded.push(name)
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
        removeUnusedModules()
          .then(() => {
            const componentExportFile = path.join(
              __dirname,
              '..',
              '..',
              'client',
              'src',
              'moduleComponents.js'
            )

            fs.writeFile(
              componentExportFile,
              `export default {\n${moduleComponentsData.join(',')}\n}`,
              () => {
                fastify.log.debug('==== MODULE LOADER FINISH ====')
                fastify.log.info('Modules loaded')
                done()
              }
            )
          })
          .catch(err => errHandler(err))
      })
      .catch(err => {
        errHandler(err)
      })
  })
}
