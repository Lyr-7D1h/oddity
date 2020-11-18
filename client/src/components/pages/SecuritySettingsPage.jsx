import React from 'react'
import SettingsPage from 'Components/containers/SettingsPage'
import SecurityForm from 'Components/SecurityForm'

export default () => {
  return (
    <SettingsPage title="Security">
      <SecurityForm />
    </SettingsPage>
  )
}
