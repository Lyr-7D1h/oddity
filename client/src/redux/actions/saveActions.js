export const SAVE_ON_RESET = 'save:onReset'
export const SAVE_ON_SAVE = 'save:onSave'
export const SAVE_ON_ESCAPE = 'save:onEscape'
export const SAVE_ON_CHANGE = 'save:onChange'

export const onSave = () => {
  return {
    type: SAVE_ON_SAVE,
  }
}

export const onChange = (caller, handler) => ({
  type: SAVE_ON_CHANGE,
  payload: { caller, handler },
})

export const onReset = () => ({ type: SAVE_ON_RESET })

export const onEscape = () => ({ type: SAVE_ON_ESCAPE })
