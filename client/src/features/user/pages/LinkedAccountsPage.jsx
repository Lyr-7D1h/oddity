import React from 'react'
import SettingsPage from 'features/user/pages/SettingsPage'
import ConnectThirdParty from 'features/user/ConnectThirdParty'

export default () => {
  return (
    <SettingsPage title="Linked Accounts">
      <ConnectThirdParty />
    </SettingsPage>
  )
}
