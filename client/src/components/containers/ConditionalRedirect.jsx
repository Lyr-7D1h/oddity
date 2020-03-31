import React from 'react'
import { Redirect } from 'react-router-dom'

export default ({ children, condition, path }) => {
  if (condition) {
    return <Redirect to={path || ''} />
  } else {
    return children
  }
}
