import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

export default ({ routes, selected }) => {
  return (
    <Breadcrumb>
      {routes.map((route, key) => {
        const last = routes.indexOf(route) === routes.length - 1
        return last ? (
          <Breadcrumb.Item key={key}>
            <span>{route.breadcrumbName}</span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={key}>
            <Link to={route.path}>{route.breadcrumbName}</Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
