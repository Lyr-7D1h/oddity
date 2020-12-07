import { configureStore } from '@reduxjs/toolkit'

import importerRedux from '../../module_loader_imports/redux'

import { RESET } from 'Actions/rootActions'

import saveReducer from './reducers/saveReducer'
import initReducer from './reducers/initReducer'
import userReducer from './reducers/userReducer'

const rootMiddleware = (state, action) => {
  if (action.type === RESET) {
    // Reset all imported reducers
    const importedKeys = importerRedux.reducers.map((reducer) => reducer[0])
    // const updatedKeys = Object.keys(reducers).filter(
    //   (key) => -1 !== importedKeys.indexOf(key)
    // )

    // updatedKeys.forEach((key) => {
    //   state[key] = undefined
    // })
  }
}

const reducer = {
  user: userReducer,
  save: saveReducer,
  init: initReducer,
}
importerRedux.reducers.forEach((reducer) => {
  reducer[reducer[0]] = reducer[1]
})

const store = configureStore({
  reducer,
})

export default store
