import React from 'react'
import { Redirect } from 'react-router-dom'

import { connect } from 'react-redux'

/**
 * Used to check if someone is logged in otherwise will redirect to home page
 */
const AdminRedirect = ({ children, permissions }) => {
  if (permissions === 1) {
    return children
  } else {
    return <Redirect to="/" />
  }
}

export default connect(state => ({ permissions: state.user.permissions }))(
  AdminRedirect
)
