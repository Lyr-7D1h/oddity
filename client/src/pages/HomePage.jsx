import React from 'react'
import { Layout } from 'antd'

import Nav from '../components/Nav'
import configReader from '../helpers/configReader'

export default ({ location }) => {
  const config = configReader(location)
  return (
    <Layout>
      <Nav config={config} />
    </Layout>
  )
}
