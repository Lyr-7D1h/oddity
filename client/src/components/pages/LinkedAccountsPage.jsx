import React from 'react'
import SettingsPage from 'Components/containers/SettingsPage'
import ConnectThirdParty from 'Components/ConnectThirdParty'

export default () => {
  return (
    <SettingsPage title="Linked Accounts">
      <ConnectThirdParty />
    </SettingsPage>
  )
}
