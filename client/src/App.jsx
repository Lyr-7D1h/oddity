import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import InitLoader from './components/common/containers/InitLoader'
import FinishAccountPage from './components/user/pages/FinishAccountPage'

import Router from './Router'
import ModulesInitLoader from 'Components/common/containers/ModulesInitLoader'
import SavePopup from 'Components/common/SavePopup'

const App = ({ userNeedsSetup }) => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <InitLoader>
          <ModulesInitLoader>
            {userNeedsSetup ? <FinishAccountPage /> : <Router />}
            <SavePopup />
          </ModulesInitLoader>
        </InitLoader>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default connect((state) => {
  return {
    userNeedsSetup:
      state.user.id &&
      !state.user.hasFinishedAccount &&
      state.user.identifier !== 'root'
        ? true
        : false,
  }
})(App)
