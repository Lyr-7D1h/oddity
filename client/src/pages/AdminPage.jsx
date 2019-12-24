import React from 'react'
import { Card } from 'antd'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
import RoutingTable from '../components/RoutingTable'
import AdminRedirect from '../containers/AdminRedirect'
import SubNav from '../components/SubNav'

export default ({ page }) => {
  const nav = ['Routing', 'Forum']

  let Content
  switch (page) {
    case 'routing':
      Content = (
        <>
          <Title>Routing</Title>
          <RoutingTable />
        </>
      )
      break
    case 'forum':
      Content = <div>Forum</div>
      break
    default:
      Content = <div>Admin page</div>
      break
  }

  return (
    <AdminRedirect>
      <Page selected="admin">
        <SubNav items={nav} />
        <Centered>
          <Card>{Content}</Card>
        </Centered>
      </Page>
    </AdminRedirect>
  )
}
