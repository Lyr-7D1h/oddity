const fs = require('fs')
const path = require('path')

const MODULE_DIR = path.join(__dirname, '..', '..', 'modules')

/**
 * Fetches all client files
 */
const client = {
  redux: [],
  styling: [],
  components: []
}

/**
 * Fetches all server files
 */
const server = {
  routes: [],
  plugins: []
}

const errHandler = err => {
  if (err) {
    console.error('LOADING MODULES FAILED \n', err)
    process.exit(1)
  }
}

/**
 * Load all files and check if they are okay
 */
const init = fastify => {
  console.log(fastify.models)
  const loadConfig = path => {
    const config = require(path)

    const { name, version } = config

    console.log('CONFIG', {
      name,
      version
    })

    fastify.models.module
      .upsert(
        { name },
        {
          name,
          version
        }
      )
      .then(() => {})
      .catch(err => {
        errHandler(err)
      })
  }

  console.log(MODULE_DIR)
  fs.readdir(MODULE_DIR, (err, module_dirs) => {
    errHandler(err)

    console.log(module_dirs)
    module_dirs.forEach(module_dir => {
      const MODULE_SRC_DIR = path.join(MODULE_DIR, module_dir)
      fs.readdir(MODULE_SRC_DIR, (err, module_files) => {
        errHandler(err)

        module_files.forEach((module_file, i) => {
          switch (module_file.toLowerCase()) {
            case 'config.js':
              loadConfig(path.join(MODULE_SRC_DIR, module_file))
              break
            case 'config.json':
              loadConfig(path.join(MODULE_SRC_DIR, module_file))
              break
            case 'client':
              break
            case 'server':
              break
            default:
              console.error(`COULD NOT LOAD FILE ${module_file}`)
              break
          }

          if (i === module_files.length - 1) {
            process.exit(0)
          }
        })
      })
    })
  })
}

module.exports = { init, client, server }
