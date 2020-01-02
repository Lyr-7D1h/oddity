import React from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'

/**
 * Used to check if someone is logged in otherwise will redirect to home page
 */
const LoggedInRedirect = ({ children, user }) => {
  if (user.username !== undefined) {
    return <Redirect to="/" />
  } else {
    return children
  }
}

export default connect(state => ({ user: state.user }))(LoggedInRedirect)
