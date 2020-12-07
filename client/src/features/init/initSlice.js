import importedModules from '../../../module_loader_imports/modules'

const UPDATE_CONFIG = 'init:updateConfig'
const UPDATE_MODULE_ROUTE = 'init:updateModule'
const ENABLE_MODULE = 'init:enableModule'
const DISABLE_MODULE = 'init:disableModule'

export const updateConfig = (config) => ({
  type: UPDATE_CONFIG,
  payload: config,
})

export const updateModuleRoute = (id, route) => ({
  type: UPDATE_MODULE_ROUTE,
  payload: { id, route },
})

/// Add module if it does not already exist
export const enableModule = (module) => ({
  type: ENABLE_MODULE,
  payload: module,
})

/// Remove module if it exists
export const disableModule = (module) => ({
  type: DISABLE_MODULE,
  payload: module,
})

export default (state, { type, payload }) => {
  const newState = Object.assign({}, state)
  switch (type) {
    case UPDATE_CONFIG:
      return Object.assign({}, state, { config: payload })
    case UPDATE_MODULE_ROUTE:
      newState.modules = state.modules.map((mod) => {
        if (mod.id === payload.id) {
          mod.route = payload.route
        }
        return mod
      })
      return newState
    case ENABLE_MODULE:
      // if already exists do nothing
      if (newState.modules.some((mod) => mod.id === payload.id)) {
        return newState
      }
      // If does not exist in imported module do nothing
      if (!importedModules[payload.name]) {
        return newState
      }
      newState.modules.push(payload)
      return newState
    case DISABLE_MODULE:
      // filter out given module
      const modules = newState.modules.filter((mod) => mod.id !== payload.id)
      return Object.assign({}, state, { modules })
    default:
      if (window.init && Object.keys(window.init).length > 0) {
        // only allow modules with client routes
        let state = Object.assign({}, window.init)
        state.modules = state.modules
          .filter(
            (mod) =>
              importedModules[mod.name] &&
              importedModules[mod.name].routes.length > 0
          )
          .map((mod) => {
            mod.routes = importedModules[mod.name].routes
            return mod
          })
        return state
      } else {
        return { noInit: true }
      }
  }
}
