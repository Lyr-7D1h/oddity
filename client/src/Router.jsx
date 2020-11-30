import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import path from 'path'

import { connect } from 'react-redux'

import notificationHandler from './helpers/notificationHandler'
import moduleLoaderModules from '../module_loader_imports/modules'

import LoginPage from './components/user/pages/LoginPage'
import AdminSettingsPage from './components/admin/pages/AdminSettingsPage'
import RegisterPage from './components/user/pages/RegisterPage'
import TermsOfServicePage from './components/common/pages/TermsOfServicePage'
import NotFoundPage from './components/common/pages/NotFoundPage'
import NoHomePage from './components/common/pages/NoHomePage'
import AccountPage from './components/common/containers/AccountSettingsPage'
import ProfilePage from './components/user/pages/ProfilePage'
import ModulesPage from 'Components/admin/pages/ModulesPage'
import ModuleSettingsPage from 'Components/admin/pages/ModuleSettingsPage'
import SecuritySettingsPage from 'Components/user/pages/SecuritySettingsPage'
import LinkedAccountsPage from 'Components/user/pages/LinkedAccountsPage'
import RolesSettingsPage from 'Components/admin/pages/RolesSettingsPage'

export default connect((state) => ({ modules: state.init.modules }))(
  ({ modules }) => {
    let noHomeSet = true

    const getModuleRoutes = () => {
      if (modules.length > 0) {
        let moduleRoutes = []
        for (let i in modules) {
          const route = modules[i].route
          const mod = modules[i]

          const basePath = route === '' ? '/' : route

          if (route === '') noHomeSet = false

          // if module does not exist return continue to next iter
          if (!moduleLoaderModules[mod.name]) {
            continue
          }

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
      { path: '/settings/linked', component: LinkedAccountsPage },

      { path: '/admin', component: () => <Redirect to="admin/general" /> },
      { path: '/admin/general', component: AdminSettingsPage },
      { path: '/admin/modules', component: ModulesPage },
      { path: '/admin/modules/:module', component: ModuleSettingsPage },
      { path: '/admin/roles', component: RolesSettingsPage },
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
    )
  }
)
