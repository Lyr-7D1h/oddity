import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import ConfigLoader from './containers/ConfigLoader'
import RegisterPage from './pages/RegisterPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import NotFoundPage from './pages/NotFoundPage'

export default () => {
  return (
    <BrowserRouter>
      <ConfigLoader>
        <Switch>
          <Route exact path="/" component={HomePage}></Route>
          <Route exact path="/login" component={LoginPage}></Route>
          <Route exact path="/register" component={RegisterPage}></Route>
          <Route exact path="/admin" component={AdminPage}></Route>
          <Route exact path="/tos" component={TermsOfServicePage}></Route>
          <Route path="*" component={NotFoundPage}></Route>
        </Switch>
      </ConfigLoader>
    </BrowserRouter>
  )
}
