import importedModules from '../../../module_loader_imports/modules'
import {
  UPDATE_CONFIG,
  ENABLE_MODULE,
  DISABLE_MODULE,
  UPDATE_MODULE_ROUTE,
} from '../actions/initActions'

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
      if (newState.modules.some((mod) => mod.id === payload.id)) {
        return newState
      }
      newState.modules.push(payload)
      return newState
    case DISABLE_MODULE:
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
