export const SAVE_ON_RESET = 'save:onReset'
export const SAVE_ON_SAVE = 'save:onSave'
export const SAVE_SET_CALLER = 'save:setCaller'
export const SAVE_REMOVE_CALLER = 'save:removeCaller'
export const SAVE_SET_CALLER_ERROR = 'save:setCallerError'

export const onSave = () => {
  return {
    type: SAVE_ON_SAVE,
  }
}

export const setCaller = (caller) => ({
  type: SAVE_SET_CALLER,
  payload: { caller },
})

export const removeCaller = (caller) => ({
  type: SAVE_REMOVE_CALLER,
  payload: { caller },
})

export const setCallerError = (caller) => ({
  type: SAVE_SET_CALLER_ERROR,
  payload: { caller },
})

export const onReset = () => ({ type: SAVE_ON_RESET })
