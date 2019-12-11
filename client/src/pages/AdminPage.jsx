import React from 'react'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
import RoutingTable from '../components/RoutingTable'
import AdminRedirect from '../containers/AdminRedirect'
import ConfigForm from '../components/ConfigForm'

export default () => {
  return (
    <AdminRedirect>
      <Page selected="admin">
        <Centered>
          <ConfigForm />
          <Title>Routing</Title>
          <RoutingTable />
        </Centered>
      </Page>
    </AdminRedirect>
  )
}
