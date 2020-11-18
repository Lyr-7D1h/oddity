import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import InitLoader from './components/containers/InitLoader'
import FinishAccountPage from './components/pages/FinishAccountPage'

import Router from './Router'
import ModulesInitLoader from 'Components/containers/ModulesInitLoader'
import SavePopup from 'Components/SavePopup'

const App = ({ userNeedsSetup }) => {
  return (
    <BrowserRouter>
      <InitLoader>
        <ModulesInitLoader>
          {userNeedsSetup ? <FinishAccountPage /> : <Router />}
          <SavePopup />
        </ModulesInitLoader>
      </InitLoader>
    </BrowserRouter>
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
