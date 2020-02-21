const fs = require('fs')
const path = require('path')

const fastifyAutoload = require('fastify-autoload')

const MODULE_DIR = path.join(__dirname, '..', '..', 'modules')

const errHandler = err => {
  if (err) {
    console.error('LOADING MODULES FAILED \n', err)
    process.exit(1)
  }
}

/**
 * Load all files and check if they are okay
 */
module.exports = (fastify, _, done) => {
  fastify.log.debug('==== MODULE LOADER START ====')

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

      fs.readdir(serverPath, (err, folders) => {
        if (err) reject(err)

        const serverModuleLoaders = []
        folders.forEach(folder => {
          switch (folder) {
            case 'routes':
              loadRoutes(path.join(serverPath, folder))
              break
            case 'plugins':
              break
            default:
              console.error(`COULD NOT LOAD ${serverPath}/${folder}`)
          }
        })
        resolve(serverModuleLoaders)
      })
    })
  }

  fs.readdir(MODULE_DIR, (err, module_dirs) => {
    errHandler(err)

    module_dirs.forEach(module_dir => {
      const MODULE_SRC_DIR = path.join(MODULE_DIR, module_dir)
      fs.readdir(MODULE_SRC_DIR, (err, module_files) => {
        errHandler(err)

        const module_loaders = []
        module_files.forEach(module_file => {
          switch (module_file.toLowerCase()) {
            case 'config.js':
              module_loaders.push(
                loadConfig(path.join(MODULE_SRC_DIR, module_file))
              )
              break
            case 'config.json':
              module_loaders.push(
                loadConfig(path.join(MODULE_SRC_DIR, module_file))
              )
              break
            case 'client':
              module_loaders.push(
                loadClient(path.join(MODULE_SRC_DIR, module_file))
              )
              break
            case 'server':
              module_loaders.push(
                loadServer(path.join(MODULE_SRC_DIR, module_file))
              )
              break
            default:
              console.error(`COULD NOT LOAD FILE ${module_file}`)
              break
          }
        })
        Promise.all(module_loaders)
          .then(() => {
            fastify.log.debug('==== MODULE LOADER FINISH ====')
            fastify.log.info('Modules loaded')
            done()
          })
          .catch(err => {
            errHandler(err)
          })
      })
    })
  })
}
