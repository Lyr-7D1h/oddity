import React from 'react'
import Page from './Page'
import SubNav from 'Components/SubNav'
import Centered from './Centered'
import { Card } from 'antd'
// import ConditionalRedirect from './ConditionalRedirect'
// import hasPermission from 'Helpers/hasPermission'

export default ({ children }) => {
  const nav = ['General', 'Modules', 'Roles']

  return (
    // <ConditionalRedirect condition={!hasPermission('ROOT')}>
    <Page selected="admin">
      <SubNav items={nav} />
      <Centered>
        <Card>{children}</Card>
      </Centered>
    </Page>
    // </ConditionalRedirect>
  )
}
