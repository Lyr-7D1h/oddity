import {
  SAVE_ON_SAVE,
  SAVE_ON_RESET,
  SAVE_SET_CALLER,
  SAVE_REMOVE_CALLER,
  SAVE_SET_CALLER_ERROR,
} from 'Actions/saveActions'

const initialState = {
  saveAttempt: null,
  callers: [],
  errors: [],
}

export default (state = initialState, { type, payload }) => {
  let callers
  let errors
  switch (type) {
    case SAVE_SET_CALLER:
      callers = Object.assign([], state.callers)
      callers.push(payload.caller)
      return Object.assign({}, state, { saveAttempt: 0, callers })

    case SAVE_REMOVE_CALLER:
      callers = Object.assign([], state.callers)
      callers = callers.filter((caller) => caller !== payload.caller)

      errors = Object.assign([], state.error)
      errors.filter((errorCaller) => errorCaller !== payload.caller)

      if (errors.length === 0 && callers.length === 0) {
        return initialState
      } else {
        return Object.assign({}, state, {
          callers,
          errors,
        })
      }

    case SAVE_SET_CALLER_ERROR:
      errors = Object.assign([], state.errors)
      errors.push(payload.caller)
      return Object.assign({}, state, { errors })

    case SAVE_ON_SAVE:
      state = Object.assign({}, state, { saveAttempt: state.saveAttempt + 1 })
      return state

    case SAVE_ON_RESET:
      return Object.assign({}, state, initialState)

    default:
      return state
  }
}
