import React from 'react'
import SettingsPage from 'Components/containers/SettingsPage'
import { connect } from 'react-redux'
import UserInformationForm from 'Components/UserInformationForm'
import SavePopup from 'Components/SavePopup'

export default connect((state) => ({ user: state.user }))(({ user }) => {
  return (
    <SettingsPage title="Profile">
      <UserInformationForm />
      <SavePopup />
    </SettingsPage>
  )
})
