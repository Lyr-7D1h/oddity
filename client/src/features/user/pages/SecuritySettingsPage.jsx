import React from 'react'
import SettingsPage from 'features/user/pages/SettingsPage'
import SecurityForm from 'features/user/SecurityForm'

export default () => {
  return (
    <SettingsPage title="Security">
      <SecurityForm />
    </SettingsPage>
  )
}
