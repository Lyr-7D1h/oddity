import { createStore, combineReducers } from 'redux'

import captchaReducer from './reducers/captchaReducer'
import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'
import permissionReducer from './reducers/permissionReducer'
import moduleReducer from './reducers/modulesReducer'

import redux from '../../module_loader_imports/redux'

const reducers = {
  config: configReducer,
  user: userReducer,
  modules: moduleReducer,
  captcha: captchaReducer,
  permissions: permissionReducer,
}

redux.reducers.forEach((reducer) => {
  reducers[reducer[0]] = reducer[1]
})

const store = createStore(
  combineReducers(reducers),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
