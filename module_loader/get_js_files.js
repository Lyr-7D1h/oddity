const fs = require('fs')

module.exports = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) reject(err)

      resolve(files.filter((file) => file.endsWith('.js')))
    })
  })
}
