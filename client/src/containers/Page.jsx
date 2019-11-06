import React from 'react'
import { Layout } from 'antd'
import Nav from '../components/Nav'

export default ({ children, config, selected }) => {
  return (
    <Layout>
      <Nav config={config} selected={selected}></Nav>
      <Layout style={{ padding: '10px' }}>{children}</Layout>
    </Layout>
  )
}
