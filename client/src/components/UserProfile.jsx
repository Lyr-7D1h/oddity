import React from 'react'
import { Card, Layout, Avatar } from 'antd'
import Centered from './containers/Centered'

const { Header } = Layout

export default ({ user }) => {
  return (
    <Centered>
      <Card>
        <Layout>
          <Header className="component-background" style={{ fontSize: '20px' }}>
            <Avatar src={user.avatar} /> {user.username} (#{user.identifier})
          </Header>
        </Layout>
      </Card>
    </Centered>
  )
}
