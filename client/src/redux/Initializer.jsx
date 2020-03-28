import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import requester from '../helpers/requester'
import getUser from '../helpers/getUser'

import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'
import moduleReducer from './reducers/modulesReducer'

import { updateUser } from './actions/userActions'
import { updateConfig, fetchConfig } from './actions/configActions'
import { fetchModules, updateModules } from './actions/moduleActions'
import routesReducer from './reducers/routesReducer'
import { updateRoutes, fetchRoutes } from './actions/routesActions'

const store = createStore(
  combineReducers({
    config: configReducer,
    user: userReducer,
    modules: moduleReducer,
    routes: routesReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const Initializer = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

// Load user if logged in
const user = getUser()
if (user.username !== undefined) {
  store.dispatch(updateUser(user))
}

// Load config from /api/config
store.dispatch(fetchConfig())
store.dispatch(fetchModules())
store.dispatch(fetchRoutes())
requester.get('init').then(init => {
  store.dispatch(updateModules(init.modules))
  store.dispatch(updateConfig(init.config))
  store.dispatch(updateRoutes(init.routes))
})
