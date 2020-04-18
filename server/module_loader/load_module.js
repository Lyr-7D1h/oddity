const glob = require('glob')
const path = require('path')
const fs = require('fs')

const loadClient = require('./client_importer').load
const { load: loadServer, addModule } = require('./server_importer')

module.exports = (modulePath) => {
  return new Promise((resolve, reject) => {
    glob('?(config.js|config.json)', { cwd: modulePath }, (err, matches) => {
      if (err) reject(err)

      let config = matches[0]
      if (config && matches.length === 1) {
        // Fetch config
        config = require(path.join(modulePath, config))
        const { name, version } = config

        console.debug(`Loading module ${name}\t(${version})`)
        addModule(name, version)

        const srcLoaders = []
        // Load Module Directory
        fs.readdir(modulePath, (err, moduleFiles) => {
          if (err) reject(err)

          moduleFiles.forEach((moduleFile) => {
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
              resolve()
            })
            .catch((err) => reject(err))
        })
      } else {
        reject(new Error(`Config File not found in ${modulePath}`))
      }
    })
  })
}
