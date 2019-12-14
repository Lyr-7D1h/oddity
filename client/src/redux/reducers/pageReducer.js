import { SET_SELECTED } from '../actions/pageActions'

export default (state = { selected: '' }, { type, payload }) => {
  switch (type) {
    case SET_SELECTED:
      const newState = { ...state }
      newState.selected = payload.selected
      return newState
    default:
      return state
  }
}
