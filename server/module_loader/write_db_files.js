const fs = require('fs')
const path = require('path')
const getDatabaseFiles = require('./server_importer').getDatabaseFiles

/**
 * Should be run after all server components are loaded
 */
module.exports = () => {
  const { seeders, models, migrations } = getDatabaseFiles()

  const syncFiles = (sources, destination) => {
    return new Promise((resolve, reject) => {
      fs.readdir(destination, (err, existingFiles) => {
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
    syncFiles(seeders, path.join(__dirname, '../db/seeders')),
    syncFiles(models, path.join(__dirname, '../db/models')),
    syncFiles(migrations, path.join(__dirname, '../db/migrations'))
  ])
}
