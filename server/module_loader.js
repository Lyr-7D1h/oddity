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
const Fastify = require('fastify')

require('dotenv').config()

const fastifyAutoload = require('fastify-autoload')

const MODULES_DIR = path.join(__dirname, '..', 'modules')

const clientImportPath = path.join(
  __dirname,
  '..',
  'client',
  'module_loader_imports.js'
)
const clientImportData = []

const serverImportPath = path.join(__dirname, 'module_loader_imports.js')
const serverImportData = []

const modulesLoaded = []

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    prettyPrint: process.env.NODE_ENV === 'development'
  },
  dotenv: true
})

const envSchema = {
  type: 'object',
  required: ['DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'],
  properties: {
    DB_HOST: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_USERNAME: { type: 'string' },
    DB_PASSWORD: { type: 'string' }
  },
  additionalProperties: false
}

fastify
  .register(require('fastify-env'), { schema: envSchema })
  .register(require('./plugins/sequelize'))
  .register(require('./db/models'))

fastify.ready(err => {
  if (err) {
    console.error('Fastify failed')
    console.error(err)
    process.exit(1)
  }

  /**
   * Load all files and check if they are okay
   */

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
        .query('SELECT id, name FROM modules WHERE NOT name IN (?)', {
          replacements: [modulesLoaded]
        })
        .then(([mods]) => {
          if (mods.length) {
            fastify.log.debug(
              `Removing old modules (${mods.map(mod => mod.name).join(', ')})`
            )

            const ids = mods.map(mod => mod.id)

            fastify.db
              .query('DELETE FROM routes WHERE "moduleId" IN (?)', {
                replacements: [ids]
              })
              .then(() => {
                fastify.db
                  .query('DELETE FROM modules WHERE "id" IN (?)', {
                    replacements: [ids]
                  })
                  .then(() => {
                    resolve()
                  })
                  .catch(err => reject(err))
              })
              .catch(err => reject(err))
          } else {
            resolve()
          }
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
        fastify.log.debug(`Loading Plugins ${pluginPath}`)
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
          // Fetch config
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
                          clientImportData.push(
                            `\t"${name}": [\n${modules.join(',')}\t]\n`
                          )
                          resolve(true)
                        })
                        .catch(err => reject(err))
                    })
                  )
                  break
                case 'server':
                  // srcLoaders.push(loadServer(config, moduleSrcPath))
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
        // remove unused modules when all are loaded
        removeUnusedModules()
          .then(() => {
            // Write client import file
            fs.writeFile(
              clientImportPath,
              `module.exports = {\n${clientImportData.join(',')}\n}`,
              err => {
                errHandler(err)
                fs.writeFile(
                  serverImportPath,
                  `module.exports = {\n${serverImportData.join(',')}}`,
                  err => {
                    errHandler(err)
                    fastify.log.debug('==== MODULE LOADER FINISH ====')
                    fastify.log.info('Modules loaded')
                    process.exit(0)
                  }
                )
              }
            )
          })
          .catch(err => errHandler(err))
      })
      .catch(err => {
        errHandler(err)
      })
  })
})
