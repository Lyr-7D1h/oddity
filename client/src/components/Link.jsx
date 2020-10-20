import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

export default ({ to, children }) => {
  to = to.startsWith('/') ? to : '/' + to

  const root = useLocation().pathname.split('/')[1]
  // if root exists as module route then add it to the route
  if (
    useSelector((state) => state.init.modules.find((mod) => mod.route === root))
  ) {
    to = '/' + root + to
  }

  return <Link to={to}>{children}</Link>
}
