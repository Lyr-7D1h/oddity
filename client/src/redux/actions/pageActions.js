export const UPDATE_PAGE = 'age:updatePage'

export const updatePage = page => {
  return {
    type: UPDATE_PAGE,
    payload: {
      page: page
    }
  }
}
