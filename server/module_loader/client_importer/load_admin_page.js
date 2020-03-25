const path = require('path')

const checkFile = require('./check_component_file')

module.exports = (config, modulePath, clientImportData) => {
  return new Promise((resolve, reject) => {
    if (config.adminPage.includes('/')) {
      const adminPagePath = path.join(modulePath, config.adminPage)

      checkFile(adminPagePath)
        .then(found => {
          if (found) {
            clientImportData.modules[
              config.name
            ].adminPage = `require('${adminPagePath}').default`
            resolve()
          } else {
            reject(new Error(`Could not find Admin Page: ${adminPagePath}`))
          }
        })
        .catch(err => reject(err))
    } else {
      const adminPagePath = path.join(
        modulePath,
        'client',
        'components',
        config.adminPage
      )

      checkFile(adminPagePath)
        .then(found => {
          if (found) {
            clientImportData.modules[
              config.name
            ].adminPage = `require('${adminPagePath}').default`
            resolve()
          } else {
            reject(new Error(`Could not find Admin Page: ${adminPagePath}`))
          }
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}
