const path = require('path')
const glob = require('glob')
const fs = require('fs')

const clientImportPath = path.join(
  __dirname,
  '..',
  '..',
  'client',
  'module_loader_imports.js'
)
const clientImportData = {
  modules: {}
}

const load = (config, modulePath) => {
  return new Promise((resolve, reject) => {
    /**
     * Find and adding of modules to clientImportData
     */
    const loadComponents = () => {
      clientImportData.modules[config.name] = { routes: [] }

      return new Promise((resolve, reject) => {
        /**
         *  Check if /client/component/index.js or /client/component/index.jsx exists and then adds it
         *  */
        const addBaseComponent = () => {
          return new Promise((resolve, reject) => {
            const componentPath = path.join(modulePath, 'client', 'components')
            glob(
              '?(index.js|index.jsx)',
              { cwd: componentPath },
              (err, matches) => {
                if (err) reject(err)

                if (matches.length === 1) {
                  clientImportData.modules[config.name].routes.push({
                    path: '/',
                    component: `require('${path.join(
                      '../modules',
                      path.basename(modulePath),
                      'client',
                      'components',
                      matches[0]
                    )}').default`
                  })
                  resolve(true)
                } else {
                  resolve(false)
                }
              }
            )
          })
        }

        if (config.routes) {
          let hasBasePath = false

          const routesPromises = []
          // Read defined routes if no "/" or "" defined use /client/components
          config.routes.forEach(route => {
            if (route.path === '' || route.path === '/') {
              hasBasePath = true
            }

            const filename = path.basename(route.component).split('.')[0]
            const componentPath = path.join(
              modulePath,
              path.dirname(route.component)
            )

            routesPromises.push(
              new Promise((resolve, reject) => {
                // check if component exists
                glob(
                  `?(${filename}.js|${filename}.jsx)`,
                  { cwd: componentPath },
                  (err, matches) => {
                    if (err) reject(err)

                    if (matches.length === 1) {
                      clientImportData.modules[config.name].routes.push({
                        path: route.path,
                        component: `require('${path.join(
                          '../modules',
                          path.basename(modulePath),
                          route.component
                        )}').default`
                      })
                      resolve()
                    } else {
                      reject(new Error(`Component ${componentPath} not found`))
                    }
                  }
                )
              })
            )
          })
          Promise.all(routesPromises)
            .then(modules => {
              if (!hasBasePath) {
                addBaseComponent()
                  .then(() => {
                    resolve(modules)
                  })
                  .catch(err => reject(err))
              } else {
                resolve(modules)
              }
            })
            .catch(err => reject(err))
        } else {
          // Read /client/components
          addBaseComponent()
            .then(created => {
              if (created) {
                resolve()
              } else {
                console.debug(`No clientside routes found for ${config.name}`)
              }
            })
            .catch(err => reject(err))
        }
      })
    }

    /**
     * Wait and load
     */
    const clientLoaders = [
      new Promise(resolve => {
        fs.access(path.join(modulePath, 'client', 'components'), err => {
          if (!err)
            loadComponents().then(() => {
              resolve()
            })
        })
      })
    ]

    Promise.all(clientLoaders)
      .then(() => {
        resolve()
      })
      .catch(err => reject(err))
  })
}

const write = () => {
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

// Only loads components
module.exports = { load, write }
