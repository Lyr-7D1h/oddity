import React from 'react'
import { Layout } from 'antd'
import Nav from '../Nav'

export default ({ children, selected }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Nav selected={selected}></Nav>
      <Layout style={{ padding: '10px' }}>{children}</Layout>
    </Layout>
  )
}
