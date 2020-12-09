import React from 'react'
import SettingsPage from 'Features/user/pages/SettingsPage'
import { connect } from 'react-redux'
import UserInformationForm from 'Features/user/UserInformationForm'

export default connect((state) => ({ user: state.user }))(({ user }) => {
  return (
    <SettingsPage title="Profile">
      <UserInformationForm />
    </SettingsPage>
  )
})
