import React from 'react'
import { Card } from 'antd'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
// import RoutingTable from '../RoutingTable'
import AdminRedirect from '../containers/AdminRedirect'
import SubNav from '../SubNav'
import ForumTable from '../ForumTable'
import ModulesTable from '../ModulesTable'

export default ({ match }) => {
  const nav = ['Routing', 'Forum', 'Modules']

  let Content
  switch (match.params.page) {
    case 'routing':
      Content = (
        <>
          <Title>Routing</Title>
          {/* <RoutingTable /> */}
        </>
      )
      break
    case 'modules':
      Content = (
        <>
          <Title>Modules</Title>
          <ModulesTable />
        </>
      )

      break
    case 'forum':
      Content = (
        <>
          <Title>Forum</Title>
          <ForumTable />
        </>
      )
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
