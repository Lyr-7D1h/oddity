import React from 'react'
import { Provider } from 'react-redux'

import requester from '../helpers/requester'
import getUser from '../helpers/getUser'

import { updateUser } from './actions/userActions'
import { updateConfig, fetchConfig } from './actions/configActions'
import { fetchModules, updateModules } from './actions/moduleActions'
import { fetchCaptcha, updateCaptcha } from './actions/captchaActions'
import { fetchPermissions, updatePermissions } from 'Actions/permissionsActions'

import store from './store'

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
store.dispatch(fetchCaptcha())
store.dispatch(fetchPermissions())
requester.get('init').then((init) => {
  store.dispatch(updateModules(init.modules))
  store.dispatch(updateConfig(init.config))
  store.dispatch(updateCaptcha(init.captcha))
  store.dispatch(updatePermissions(init.permissions))
})
