import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import requester from '../helpers/requester'
import getUser from '../helpers/getUser'

import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'
import pageReducer from './reducers/pageReducer'

import { updateUser } from './actions/userActions'
import { updateConfig, fetchConfig } from './actions/configActions'
import { fetchModules, updateModules } from './actions/moduleActions'

const store = createStore(
  combineReducers({
    config: configReducer,
    user: userReducer,
    page: pageReducer
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
requester.get('init').then(init => {
  store.dispatch(updateConfig(init.config))
  store.dispatch(updateModules(init.modules))
})
