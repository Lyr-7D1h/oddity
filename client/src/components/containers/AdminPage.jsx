import React from 'react'
import Page from './Page'
import SubNav from 'Components/SubNav'
import Centered from './Centered'
import { Card } from 'antd'
import ConditionalRedirect from './ConditionalRedirect'
import hasPermission from 'Helpers/hasPermission'
import SavePopup from 'Components/SavePopup'
import { connect } from 'react-redux'

export default connect((state) => ({ user: state.user }))(
  ({ children, user }) => {
    const nav = ['General', 'Modules', 'Roles']

    return (
      <ConditionalRedirect condition={!hasPermission('ROOT', user)}>
        <Page selected="admin">
          <SubNav items={nav} />
          <Centered>
            <Card>{children}</Card>
          </Centered>
        </Page>
        <SavePopup context="admin" />
      </ConditionalRedirect>
    )
  }
)
