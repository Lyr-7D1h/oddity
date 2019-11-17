import { UPDATE_CONFIG, FETCH_CONFIG } from '../actions/configActions'

export default (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_CONFIG:
      return payload.config
    case FETCH_CONFIG:
      return { isLoading: true }
    default:
      return state
  }
}
