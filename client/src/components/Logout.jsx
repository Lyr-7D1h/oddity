import React from 'react'
import { Redirect } from 'react-router-dom'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'
import Cookies from 'js-cookie'

export default () => {
  requester
    .logout()
    .then(() => {
      notificationHandler.success('Logged out successfully')
    })
    .catch(() => {
      notificationHandler.error('Logout failed')
    })
  return <Redirect to="/" />
}
