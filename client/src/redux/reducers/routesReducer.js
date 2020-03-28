import { UPDATE_ROUTES, FETCH_ROUTES } from '../actions/routesActions'

export default (state = [], { type, payload }) => {
  switch (type) {
    case UPDATE_ROUTES:
      return payload.routes
    case FETCH_ROUTES:
      return []
    default:
      return state
  }
}
