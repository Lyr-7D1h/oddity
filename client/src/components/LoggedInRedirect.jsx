import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { Redirect } from 'react-router-dom'

export default ({ children }) => {
  const [loggedIn] = useState(Cookies.get('loggedIn') !== undefined)

  if (loggedIn) {
    return <Redirect to="/" />
  } else {
    return children
  }
}
