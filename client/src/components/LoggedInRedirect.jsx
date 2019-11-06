import React from 'react'
import { Redirect } from 'react-router-dom'

/**
 * Used to check if someone is logged in otherwise will redirect to home page
 */
export default ({ children, loggedIn }) => {
  if (loggedIn) {
    return <Redirect to="/" />
  } else {
    return children
  }
}
