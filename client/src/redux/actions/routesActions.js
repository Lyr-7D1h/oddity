export const UPDATE_ROUTES = 'routes:updateRoutes'
export const FETCH_ROUTES = 'routes:fetchRoutes'

export const updateRoutes = routes => {
  return {
    type: UPDATE_ROUTES,
    payload: {
      routes: routes
    }
  }
}
export const fetchRoutes = () => {
  return {
    type: FETCH_ROUTES
  }
}
