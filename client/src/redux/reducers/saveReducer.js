import {
  SAVE_ON_SAVE,
  SAVE_ON_RESET,
  SAVE_ON_ESCAPE,
  SAVE_ON_CHANGE,
} from 'Actions/saveActions'

export default (
  state = { showSavePopup: false, callers: {} },
  { type, payload }
) => {
  switch (type) {
    case SAVE_ON_CHANGE:
      const callers = Object.assign({}, state.callers, {
        [payload.caller]: payload.handler,
      })
      console.log(payload)
      return Object.assign({}, state, { showSavePopup: true, callers })
    case SAVE_ON_SAVE:
      return {}
    case SAVE_ON_RESET:
      return {}
    case SAVE_ON_ESCAPE:
      return {}
    default:
      return state
  }
}
