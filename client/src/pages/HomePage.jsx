import React from 'react'
import { Layout } from 'antd'

import Nav from '../components/Nav'

import queryString from 'query-string'

export default ({ location }) => {
  const config = queryString.parse(location.search)
  console.log(config)
  return (
    <Layout>
      <Nav config={config} />
    </Layout>
  )
}
