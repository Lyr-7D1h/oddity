import React from 'react'
import SettingsPage from 'Features/user/pages/SettingsPage'
import SecurityForm from 'Features/user/SecurityForm'

export default () => {
  return (
    <SettingsPage title="Security">
      <SecurityForm />
    </SettingsPage>
  )
}
