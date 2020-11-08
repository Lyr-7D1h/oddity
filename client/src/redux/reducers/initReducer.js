import {
  UPDATE_CONFIG,
  ENABLE_MODULE,
  DISABLE_MODULE,
} from '../actions/initActions'

export default (state, { type, payload }) => {
  switch (type) {
    case UPDATE_CONFIG:
      return Object.assign({}, state, { config: payload })
    case ENABLE_MODULE:
      if (state.modules.some((mod) => mod.id === payload.id)) {
        return state
      }
      state.modules.push(payload)
      return Object.assign({}, state)
    case DISABLE_MODULE:
      const modules = state.modules.filter((mod) => mod.id !== payload.id)
      return Object.assign({}, state, { modules })
    default:
      if (window.init && Object.keys(window.init).length > 0) {
        return window.init
      } else {
        return { noInit: true }
      }
  }
}
