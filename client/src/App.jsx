import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import notificationHandler from './helpers/notificationHandler'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import ConfigLoader from './containers/ConfigLoader'
import RegisterPage from './pages/RegisterPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import NotFoundPage from './pages/NotFoundPage'
import ForumPage from './pages/ForumPage'
import ServersPage from './pages/ServersPage'
import mapAgeCleaner from 'map-age-cleaner'

const App = ({ modules }) => {
  let serversRoute = ''
  let forumRoute = ''

  if (modules) {
    for (let i in modules) {
      const mod = modules[i]
      switch (mod.config) {
        case 'servers':
          serversRoute = mod.route
          break
        case 'forum':
          forumRoute = mod.route
          break
        default:
          console.log(mod)
          notificationHandler.error('Modules misconfigured')
      }
    }
  }

  return (
    <BrowserRouter>
      <ConfigLoader>
        {modules ? (
          <Switch>
            {modules.map((mod, i) => {
              let component = NotFoundPage
              switch (mod.config) {
                case 'servers':
                  component = ServersPage
                  break
                case 'forum':
                  component = ForumPage
                  break
                default:
                  notificationHandler.error('Modules misconfigured')
              }

              return (
                <Route
                  key={i}
                  exact
                  path={'/' + mod.route}
                  component={component}
                ></Route>
              )
            })}
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/login" component={LoginPage}></Route>
            <Route exact path="/register" component={RegisterPage}></Route>
            <Route exact path="/admin" component={AdminPage}></Route>
            <Route exact path="/tos" component={TermsOfServicePage}></Route>
            <Route path="*" component={NotFoundPage}></Route>
          </Switch>
        ) : (
          ''
        )}
      </ConfigLoader>
    </BrowserRouter>
  )
}

export default connect(state => ({ modules: state.config.modules }))(App)
