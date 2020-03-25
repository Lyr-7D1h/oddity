import React from 'react'
import { Card } from 'antd'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
import AdminRedirect from '../containers/AdminRedirect'
import SubNav from '../SubNav'
import ModulesTable from '../ModulesTable'
import { Redirect } from 'react-router-dom'

export default ({ match }) => {
  const nav = ['General', 'Modules']

  if (!match.params.page) {
    return <Redirect to="/admin/general"></Redirect>
  }

  let Content
  switch (match.params.page) {
    case 'modules':
      Content = (
        <>
          <Title>Modules</Title>
          <ModulesTable />
        </>
      )
      break
    default:
      Content = <div>General Settings</div>
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
