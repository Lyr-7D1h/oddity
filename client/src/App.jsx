import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import InitLoader from './features/init/InitLoader'
import FinishAccountPage from './features/user/pages/FinishAccountPage'

import Router from './Router'
import ModulesInitLoader from 'Features/common/containers/ModulesInitLoader'
import SavePopup from 'Features/common/SavePopup'

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

// TODO: might always rerender
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
