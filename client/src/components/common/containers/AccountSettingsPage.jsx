import React from 'react'
import SettingsPage from 'Components/user/pages/SettingsPage'
import { connect } from 'react-redux'
import UserInformationForm from 'Components/user/UserInformationForm'

export default connect((state) => ({ user: state.user }))(({ user }) => {
  return (
    <SettingsPage title="Profile">
      <UserInformationForm />
    </SettingsPage>
  )
})
