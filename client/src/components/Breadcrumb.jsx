import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

export default withRouter(({ routes, location }) => {
  const selected = location.pathname.split('/')
  selected.shift()
  return (
    <Breadcrumb>
      {selected.map((route, key) => {
        const isLast = key === selected.length - 1

        const path = '/' + selected.filter((route, i) => i <= key).join('/')

        return isLast ? (
          <Breadcrumb.Item key={key}>
            <span>{route}</span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={key}>
            <Link to={path}>{route}</Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
})
