import { UPDATE_MODULES, FETCH_MODULES } from '../actions/modulesActions'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_MODULES:
      return payload.modules
    case FETCH_MODULES:
      return { isLoading: true }
    default:
      return state
  }
}
