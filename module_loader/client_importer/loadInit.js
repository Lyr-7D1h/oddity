const path = require('path')

module.exports = (config, modulesPath, clientImportData) => {
  clientImportData.modules[config.name].init = `require('${path.join(
    modulesPath,
    'client/init.js'
  )}').default`
}
