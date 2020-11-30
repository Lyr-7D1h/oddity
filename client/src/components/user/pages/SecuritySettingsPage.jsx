import React from 'react'
import SettingsPage from 'Components/user/pages/SettingsPage'
import SecurityForm from 'Components/user/SecurityForm'

export default () => {
  return (
    <SettingsPage title="Security">
      <SecurityForm />
    </SettingsPage>
  )
}
