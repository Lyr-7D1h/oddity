import React from 'react'
import Page from '../containers/Page'
import LoggedInRedirect from '../containers/LoggedInRedirect'

export default () => {
  return (
    <LoggedInRedirect>
      <Page>Account</Page>
    </LoggedInRedirect>
  )
}
