import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

export default connect(state => ({ selected: state.page.selected }))(
  ({ routes, selected }) => {
    const render = (route, params, routes, paths) => {
      const last = routes.indexOf(route) === routes.length - 1
      const path =
        paths.join('/') == '' ? `/${selected[0]}` : `/${paths.join('/')}`
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <Link to={path}>{route.breadcrumbName}</Link>
      )
    }
    return <Breadcrumb itemRender={render} routes={routes} />
  }
)
