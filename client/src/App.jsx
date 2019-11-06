import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './styling/App.less'

import HomePage from './pages/HomePage'

export default () => {
  return (
    <BrowserRouter>
      <Route path="/" component={HomePage}></Route>
    </BrowserRouter>
  )
}
