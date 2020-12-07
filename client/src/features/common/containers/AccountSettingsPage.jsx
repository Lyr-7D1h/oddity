import React from 'react'
import SettingsPage from 'features/user/pages/SettingsPage'
import { connect } from 'react-redux'
import UserInformationForm from 'features/user/UserInformationForm'

export default connect((state) => ({ user: state.user }))(({ user }) => {
  return (
    <SettingsPage title="Profile">
      <UserInformationForm />
    </SettingsPage>
  )
})
