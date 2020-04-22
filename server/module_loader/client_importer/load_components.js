const path = require('path')

const checkFile = require('./check_component_file')

/**
 * Find and adding of modules to clientImportData
 */
module.exports = (config, modulePath, clientImportData) => {
  const pushRoute = (path, componentPath) => {
    clientImportData.modules[config.name].routes.push({
      path: path,
      component: `require('${componentPath}').default`,
    })
  }

  console.debug(`${config.name}: Loading Components`)

  return new Promise((resolve, reject) => {
    /**
     *  Check if /client/component/index.js or /client/component/index.jsx exists and then adds it
     *  */
    if (config.routes) {
      const routesPromises = []

      config.routes.forEach((route) => {
        routesPromises.push(
          new Promise((resolve, reject) => {
            if (route.component.includes('/')) {
              const componentPath = path.join(modulePath, route.component)
              checkFile(componentPath)
                .then((found) => {
                  if (found) {
                    pushRoute(route.path, componentPath)
                    resolve()
                  } else {
                    reject(
                      new Error(
                        `Could not find component file: ${componentPath}`
                      )
                    )
                  }
                })
                .catch((err) => reject(err))
            } else {
              const componentPath = path.join(
                modulePath,
                'client',
                'components',
                route.component
              )
              checkFile(componentPath)
                .then((found) => {
                  if (found) {
                    pushRoute(route.path, componentPath)
                    resolve()
                  } else {
                    reject(
                      new Error(
                        `Could not find component file: ${componentPath}`
                      )
                    )
                  }
                })
                .catch((err) => reject(err))
            }
          })
        )
      })

      Promise.all(routesPromises)
        .then(() => {
          resolve()
        })
        .catch((err) => reject(err))
    } else {
      // Search for index if nothing defined
      const componentPath = path.join(
        modulePath,
        'client',
        'components',
        'index'
      )
      checkFile(componentPath)
        .then((found) => {
          if (found) pushRoute('/', componentPath)
          // Ignore if it could not find anything
          resolve()
        })
        .catch((err) => reject(err))
    }
  })
}
