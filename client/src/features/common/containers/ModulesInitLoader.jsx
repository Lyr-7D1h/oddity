import errorHandler from 'Helpers/errorHandler'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import importedModules from '../../../../module_loader_imports/modules'

export default connect((state) => ({ modules: state.init.modules }))(
  ({ modules, dispatch, children }) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      if (!loaded) {
        const effectiveInits = modules
          .filter((mod) => importedModules[mod.name])
          .map((mod) => importedModules[mod.name].init)
          .filter((mod) => mod !== undefined)
          .map((mod) => {
            if (typeof mod == Promise) {
              return mod
            } else {
              return mod(dispatch)
            }
          })

        Promise.all(effectiveInits)
          .catch((err) =>
            errorHandler(err, {
              title: 'Failed to load initial data from module',
            })
          )
          .finally(() => setLoaded(true))
      }
    }, [loaded, modules, dispatch])

    if (loaded) {
      return children
    } else {
      return <></>
    }
  }
)
