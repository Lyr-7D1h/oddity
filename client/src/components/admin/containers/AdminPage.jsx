import React from 'react'
import Page from '../../containers/Page'
import SubNav from 'Components/SubNav'
import Centered from '../../containers/Centered'
import { Card } from 'antd'
import ConditionalRedirect from '../../containers/ConditionalRedirect'
import hasPermission from 'Helpers/hasPermission'
import { connect } from 'react-redux'
import Title from 'antd/lib/typography/Title'

export default connect((state) => ({ user: state.user }))(
  ({ children, user, title, customLayout }) => {
    const nav = ['General', 'Modules', 'Roles']
    return (
      <ConditionalRedirect condition={!hasPermission('ADMIN', user)}>
        <Page selected="admin">
          <Centered>
            <SubNav items={nav} />
            {customLayout ? (
              <>
                {title && <Title>{title}</Title>}
                {children}
              </>
            ) : (
              <Card>
                {title && <Title>{title}</Title>}
                {children}
              </Card>
            )}
          </Centered>
        </Page>
      </ConditionalRedirect>
    )
  }
)
