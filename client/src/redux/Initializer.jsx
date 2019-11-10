import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import requester from '../helpers/requester'
import getUser from '../helpers/getUser'

import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'

import { updateUser } from './actions/userActions'
import { updateConfig } from './actions/configActions'

const store = createStore(
  combineReducers({
    config: configReducer,
    user: userReducer
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
requester.get('config').then(config => {
  store.dispatch(updateConfig(config))
})
