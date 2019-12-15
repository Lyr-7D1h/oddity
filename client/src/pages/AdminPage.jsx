import React from 'react'
import { Card } from 'antd'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
import RoutingTable from '../components/RoutingTable'
import AdminRedirect from '../containers/AdminRedirect'

export default () => {
  return (
    <AdminRedirect>
      <Page selected="admin">
        <Centered>
          <Card>
            <Title>Routing</Title>
            <RoutingTable />
          </Card>
        </Centered>
      </Page>
    </AdminRedirect>
  )
}
