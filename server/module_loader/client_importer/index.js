const path = require('path')
const fs = require('fs')

const clientImportPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'client',
  'module_loader_imports.js'
)
const clientImportData = {
  modules: {}
}

const loadComponents = require('./load_components')
const loadAdminPage = require('./load_admin_page')

exports.load = (config, modulePath) => {
  return new Promise((resolve, reject) => {
    clientImportData.modules[config.name] = { routes: [] }
    const clientLoaders = [loadComponents(config, modulePath, clientImportData)]

    if (config.adminPage) {
      clientLoaders.push(loadAdminPage(config, modulePath, clientImportData))
    }

    Promise.all(clientLoaders)
      .then(() => {
        resolve()
      })
      .catch(err => reject(err))
  })
}

exports.write = () => {
  return new Promise((resolve, reject) => {
    const clientFile = `module.exports = ${JSON.stringify(clientImportData)}`
      .replace(/("require\()/g, 'require(')
      .replace(/\).default"/g, ').default')

    fs.writeFile(clientImportPath, clientFile, err => {
      if (err) reject(err)
      resolve()
    })
  })
}
