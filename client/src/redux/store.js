import { createStore, combineReducers } from 'redux'

import importerRedux from '../../module_loader_imports/redux'

import { RESET } from 'Actions/rootActions'

import saveReducer from './reducers/saveReducer'
import initReducer from './reducers/initReducer'
import userReducer from './reducers/userReducer'

const reducers = {
  user: userReducer,
  save: saveReducer,
  init: initReducer,
}

importerRedux.reducers.forEach((reducer) => {
  reducers[reducer[0]] = reducer[1]
})

const appReducer = combineReducers(reducers)

const rootReducer = (state, action) => {
  if (action.type === RESET) {
    // Reset all imported reducers
    const importedKeys = importerRedux.reducers.map((reducer) => reducer[0])
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
