import React from 'react'
import { Layout } from 'antd'

import Nav from '../components/Nav'
import configReader from '../helpers/configReader'

export default props => {
  console.log(props)
  const config = configReader(props)
  return (
    <Layout>
      <Nav config={config} />
    </Layout>
  )
}
