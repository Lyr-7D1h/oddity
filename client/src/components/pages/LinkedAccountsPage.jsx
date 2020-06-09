import React from 'react'
import SettingsPage from 'Components/containers/SettingsPage'
import SavePopup from 'Components/SavePopup'
import ConnectThirdParty from 'Components/ConnectThirdParty'

export default () => {
  return (
    <SettingsPage title="Linked Accounts">
      <ConnectThirdParty />
      <SavePopup />
    </SettingsPage>
  )
}
