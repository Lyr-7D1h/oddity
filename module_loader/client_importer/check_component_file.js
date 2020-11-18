const path = require('path')
const glob = require('glob')

module.exports = componentPath => {
  const filename = path.basename(componentPath).split('.')[0]

  return new Promise((resolve, reject) => {
    glob(
      `?(${filename}.js|${filename}.jsx)`,
      { cwd: path.dirname(componentPath) },
      (err, matches) => {
        if (err) reject(err)

        switch (matches.length) {
          case 1:
            return resolve(true)
          case 0:
            return resolve(false)
          default:
            reject(new Error(`Multiple files found: ${componentPath}`))
        }
      }
    )
  })
}
