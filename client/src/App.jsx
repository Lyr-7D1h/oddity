import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import path from 'path'

import { connect } from 'react-redux'

import notificationHandler from './helpers/notificationHandler'

import LoginPage from './components/pages/LoginPage'
import AdminSettingsPage from './components/pages/AdminSettingsPage'
import InitLoader from './components/containers/InitLoader'
import RegisterPage from './components/pages/RegisterPage'
import TermsOfServicePage from './components/pages/TermsOfServicePage'
import NotFoundPage from './components/pages/NotFoundPage'
import NoHomePage from './components/pages/NoHomePage'
import AccountPage from './components/pages/AccountSettingsPage'
import FinishAccountPage from './components/pages/FinishAccountPage'

import moduleLoaderModules from '../module_loader_imports/modules'
import ProfilePage from './components/pages/ProfilePage'
import ModulesPage from 'Components/pages/ModulesPage'
import ModuleSettingsPage from 'Components/pages/ModuleSettingsPage'
import SecuritySettingsPage from 'Components/pages/SecuritySettingsPage'

const App = ({ modules, userNeedsSetup }) => {
  let noHomeSet = true

  const getModuleRoutes = () => {
    if (modules.length > 0) {
      let moduleRoutes = []
      for (let i in modules) {
        const route = modules[i].route
        const mod = modules[i]

        const basePath = route === '' ? '/' : route

        if (route === '') noHomeSet = false

        if (mod) {
          const modRoutes = moduleLoaderModules[mod.name].routes
          if (modRoutes) {
            modRoutes.forEach((moduleRoute) => {
              moduleRoutes.push(
                <Route
                  path={'/' + path.join(basePath, moduleRoute.path)}
                  key={i}
                  exact
                  render={(props) => {
                    return React.createElement(moduleRoute.component, props)
                  }}
                />
              )
            })
          } else {
            console.error(`No Routes for Module: ${mod} found`)
            notificationHandler.error(`No Routes for Module: ${mod} found`)
          }
        } else {
          console.error(`Module ${mod} is not defined`, route)
          notificationHandler.error('Unknown module is used')
        }
      }
      return moduleRoutes
    }
  }

  const defaultRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/tos', component: TermsOfServicePage },
    { path: '/u/:identifier', component: ProfilePage },

    { path: '/settings', component: AccountPage },
    { path: '/settings/security', component: SecuritySettingsPage },

    { path: '/admin', component: () => <Redirect to="admin/general" /> },
    { path: '/admin/general', component: AdminSettingsPage },
    { path: '/admin/modules', component: ModulesPage },
    { path: '/admin/modules/:module', component: ModuleSettingsPage },
  ].map((route, i) => {
    return (
      <Route
        key={i}
        exact
        path={route.path}
        render={(props) => {
          return React.createElement(route.component, props)
        }}
      />
    )
  })

  return (
    <BrowserRouter>
      <InitLoader>
        {userNeedsSetup ? (
          <FinishAccountPage />
        ) : (
          <Switch>
            {defaultRoutes}

            {getModuleRoutes()}

            {noHomeSet && <Route exact path="/" component={NoHomePage}></Route>}

            {/* Remove Trailing / in url */}
            <Route
              path="/:url*(/+)"
              exact
              strict
              render={({ location }) => (
                <Redirect to={location.pathname.replace(/\/+$/, '')} />
              )}
            />
            {/* Removes duplicate slashes in the middle of the URL */}
            <Route
              path="/:url(.*//+.*)"
              exact
              strict
              render={({ match }) => (
                <Redirect to={`/${match.params.url.replace(/\/\/+/, '/')}`} />
              )}
            />
            <Route path="*" component={NotFoundPage}></Route>
          </Switch>
        )}
      </InitLoader>
    </BrowserRouter>
  )
}

export default connect((state) => {
  return {
    modules: state.init.modules,
    userNeedsSetup:
      state.user.id &&
      !state.user.hasFinishedAccount &&
      state.user.identifier !== 'root'
        ? true
        : false,
  }
})(App)
