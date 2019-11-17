import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './styling/App.less'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import ConfigLoader from './containers/ConfigLoader'

export default () => {
  return (
    <BrowserRouter>
      <ConfigLoader>
        <Route exact path="/" component={HomePage}></Route>
        <Route exact path="/login" component={LoginPage}></Route>
        <Route exact path="/admin" component={AdminPage}></Route>
      </ConfigLoader>
    </BrowserRouter>
  )
}
