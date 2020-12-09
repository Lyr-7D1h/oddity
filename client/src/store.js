import { configureStore } from '@reduxjs/toolkit'

import importerRedux from '../module_loader_imports/redux'

import saveReducer from './redux/reducers/saveReducer'
import userReducer from './redux/reducers/userReducer'
import rootReducer from './features/util/rootSlice'
import initReducer from 'Features/init/initSlice'

const reducers = {
  root: rootReducer,
  user: userReducer,
  save: saveReducer,
  init: initReducer,
}

importerRedux.reducers.forEach((importedReducer) => {
  reducers[importedReducer[0]] = importedReducer[1]
})

const store = configureStore({
  reducer: reducers,
})

export default store
