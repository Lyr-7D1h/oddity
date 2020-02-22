const fs = require('fs')
const path = require('path')

const fastifyAutoload = require('fastify-autoload')

const MODULES_DIR = path.join(__dirname, '..', '..', 'modules')

/**
 * Load all files and check if they are okay
 */
module.exports = (fastify, _, done) => {
  fastify.log.debug('==== MODULE LOADER START ====')

  const errHandler = err => {
    if (err) {
      fastify.log.fatal('Could not load modules \n', err)
      process.exit(1)
    }
  }

  /**
   * update or create module in database
   * @param {string} path
   */
  const loadConfig = path => {
    const config = require(path)

    const { name, version } = config

    fastify.log.debug('Loading config ', { name, version })

    return fastify.models.module.upsert({ name, version })
  }

  const loadClient = clientPath => {
    return new Promise((resolve, reject) => {
      fs.readdir(clientPath, (err, clientFiles) => {
        if (err) reject(err)

        const loadComponents = componentsPath => {
          return new Promise((resolve, reject) => {
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
    fastify.log.info(`Loading module ${path.basename(modulePath)}`)
    return new Promise((resolve, reject) => {
      fs.readdir(modulePath, (err, moduleFiles) => {
        if (err) reject(err)

        const srcLoaders = []
        moduleFiles.forEach(moduleFile => {
          const moduleSrcPath = path.join(modulePath, moduleFile)
          console.log(moduleSrcPath)
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
