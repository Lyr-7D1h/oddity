export const SET_SELECTED = 'page:setSelected'

export const setSelected = path => {
  return {
    type: SET_SELECTED,
    payload: {
      selected: path
    }
  }
}
