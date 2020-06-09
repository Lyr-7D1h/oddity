import React from 'react'
import SettingsPage from 'Components/containers/SettingsPage'
import SecurityForm from 'Components/SecurityForm'
import SavePopup from 'Components/SavePopup'

export default () => {
  return (
    <SettingsPage title="Security">
      <SecurityForm />
      <SavePopup />
    </SettingsPage>
  )
}
