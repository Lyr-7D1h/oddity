import React from 'react'
import SettingsPage from 'Components/user/pages/SettingsPage'
import ConnectThirdParty from 'Components/user/ConnectThirdParty'

export default () => {
  return (
    <SettingsPage title="Linked Accounts">
      <ConnectThirdParty />
    </SettingsPage>
  )
}
