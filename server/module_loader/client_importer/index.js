const path = require('path')
const fs = require('fs')

const clientImportPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'client',
  'module_loader_imports'
)
const clientImportData = {
  modules: {},
}

const loadComponents = require('./load_components')
const loadAdminPage = require('./load_admin_page')
const loadRedux = require('./redux')

exports.load = (config, modulePath) => {
  clientImportData.modules[config.name] = { routes: [] }
  clientImportData.redux = { actions: [], reducers: [] }
  console.log(`${config.name}: Loading Client`)

  const clientLoaders = []

  if (config.adminPage) {
    clientLoaders.push(loadAdminPage(config, modulePath, clientImportData))
  }

  return new Promise((resolve, reject) => {
    fs.readdir(path.join(modulePath, 'client'), (err, files) => {
      if (err) reject(err)

      files.forEach((file) => {
        switch (file.toLocaleLowerCase()) {
          case 'components':
            clientLoaders.push(
              loadComponents(config, modulePath, clientImportData)
            )
            break
          case 'redux':
            clientLoaders.push(loadRedux(config, modulePath, clientImportData))
            break
        }
      })

      Promise.all(clientLoaders)
        .then(() => {
          resolve()
        })
        .catch((err) => reject(err))
    })
  })
}

exports.write = () => {
  const moduleFile = `module.exports = ${JSON.stringify(
    clientImportData.modules
  )}`
    .replace(/("require\()/g, 'require(')
    .replace(/\).default"/g, ').default')

  const reduxFile = `module.exports = ${JSON.stringify(clientImportData.redux)}`
    .replace(/("require\()/g, 'require(')
    .replace(/\).default"/g, ').default')

  Promise.all([
    new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(clientImportPath, 'modules.js'),
        moduleFile,
        (err) => {
          if (err) reject(err)
          console.debug(
            'Client: /client/module_loader_imports/modules.js written'
          )

          resolve()
        }
      )
    }),
    new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(clientImportPath, 'redux.js'),
        reduxFile,
        (err) => {
          if (err) reject(err)
          console.debug(
            'Client: /client/module_loader_imports/redux.js written'
          )

          resolve()
        }
      )
    }),
  ])
}
