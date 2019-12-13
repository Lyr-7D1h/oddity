import { UPDATE_PAGE } from '../actions/pageActions'

export default (state = { selected: '' }, { type, payload }) => {
  switch (type) {
    case UPDATE_PAGE:
      return payload.page
    default:
      return state
  }
}
