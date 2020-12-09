import React from 'react'
import SettingsPage from 'Features/user/pages/SettingsPage'
import ConnectThirdParty from 'Features/user/ConnectThirdParty'

export default () => {
  return (
    <SettingsPage title="Linked Accounts">
      <ConnectThirdParty />
    </SettingsPage>
  )
}
