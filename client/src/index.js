import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import App from './App.jsx'

import './styling/app.less'

import { Initializer } from './redux/Initializer'

ReactDOM.render(
  <Initializer>
    <App />
  </Initializer>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
