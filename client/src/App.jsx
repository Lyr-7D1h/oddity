import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './styling/App.less'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

export default () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={HomePage}></Route>
      <Route exact path="/login" component={LoginPage}></Route>
    </BrowserRouter>
  )
}
