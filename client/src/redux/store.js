import { createStore, combineReducers } from 'redux'

import captchaReducer from './reducers/captchaReducer'
import configReducer from './reducers/configReducer'
import userReducer from './reducers/userReducer'
import permissionReducer from './reducers/permissionReducer'
import moduleReducer from './reducers/modulesReducer'

const store = createStore(
  combineReducers({
    config: configReducer,
    user: userReducer,
    modules: moduleReducer,
    captcha: captchaReducer,
    permissions: permissionReducer,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
