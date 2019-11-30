import React from 'react'
import Page from '../containers/Page'
import MembersTable from '../components/MembersTable'
import Centered from '../containers/Centered'

export default () => {
  return (
    <Page>
      <Centered>
        <MembersTable></MembersTable>
      </Centered>
    </Page>
  )
}
