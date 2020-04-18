import React from 'react'
import ConditionalRedirect from '../containers/ConditionalRedirect'
import Page from '../containers/Page'
import { connect } from 'react-redux'
import { Card } from 'antd'

export default connect((state) => ({ username: state.user.username }))(
  ({ username }) => {
    return (
      <ConditionalRedirect condition={!username}>
        <Page>
          <Card></Card>
        </Page>
      </ConditionalRedirect>
    )
  }
)
