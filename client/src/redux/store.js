import { createStore, combineReducers } from 'redux'

import captchaReducer from './reducers/captchaReducer'
import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'
import permissionReducer from './reducers/permissionReducer'
import moduleReducer from './reducers/modulesReducer'

import redux from '../../module_loader_imports/redux'
import { RESET } from 'Actions/rootActions'

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

const appReducer = combineReducers(reducers)

const rootReducer = (state, action) => {
  if (action.type === RESET) {
    // Reset all imported reducers
    const importedKeys = redux.reducers.map((reducer) => reducer[0])
    const updatedKeys = Object.keys(reducers).filter(
      (key) => -1 !== importedKeys.indexOf(key)
    )

    updatedKeys.forEach((key) => {
      state[key] = undefined
    })
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
