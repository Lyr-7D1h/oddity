import React from 'react'
import { Card } from 'antd'
import Page from '../containers/Page'
import Title from 'antd/lib/typography/Title'
import Centered from '../containers/Centered'
import AdminRedirect from '../containers/AdminRedirect'
import SubNav from '../SubNav'
import { Redirect } from 'react-router-dom'
import ConfigForm from 'Components/ConfigForm'
import ModulesPage from './ModulesPage'

export default ({ match }) => {
  const nav = ['General', 'Modules', 'Roles']
  if (!match.params.page) {
    return <Redirect to="/admin/general"></Redirect>
  }

  let Content
  switch (match.params.page) {
    case 'modules':
      Content = (
        <>
          <ModulesPage />
        </>
      )
      break
    case 'roles':
      Content = (
        <>
          <Title>Roles</Title>
          Coming soon
        </>
      )
      break
    default:
      Content = (
        <>
          <Title>General Settings</Title>
          <ConfigForm />
        </>
      )
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
