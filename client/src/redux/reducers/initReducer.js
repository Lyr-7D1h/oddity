import { UPDATE_CONFIG } from '../actions/initActions'

export default (state, { type, payload }) => {
  switch (type) {
    case UPDATE_CONFIG:
      return Object.assign({}, state, { config: payload })
    default:
      if (window.init && Object.keys(window.init).length > 0) {
        return window.init
      } else {
        return { noInit: true }
      }
  }
}
