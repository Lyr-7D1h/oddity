import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/browser'

import * as serviceWorker from './serviceWorker'
import App from './App.jsx'

import './styling/app.less'

import { Initializer } from './Initializer'

Sentry.init({
  dsn: 'https://b562353dd385496784e194a06c282588@sentry.io/1886753',
})

ReactDOM.render(
  <React.StrictMode>
    <Initializer>
      <App />
    </Initializer>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
serviceWorker.register()
