import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import path from 'path'

import { connect } from 'react-redux'

import notificationHandler from './helpers/notificationHandler'

import LoginPage from './components/pages/LoginPage'
import AdminPage from './components/pages/AdminPage'
import ConfigLoader from './components/containers/ConfigLoader'
import RegisterPage from './components/pages/RegisterPage'
import TermsOfServicePage from './components/pages/TermsOfServicePage'
import NotFoundPage from './components/pages/NotFoundPage'
import NoHomePage from './components/pages/NoHomePage'
import AccountPage from './components/pages/AccountSettingsPage'
// import FinishAccountPage from './components/pages/FinishAccountPage'

import moduleLoaderImports from '../module_loader_imports'
import ProfilePage from './components/pages/ProfilePage'

const App = ({ modules, userNeedsSetup, dispatch }) => {
  let noHomeSet = true

  const getModuleRoutes = () => {
    if (modules.length > 0) {
      let moduleRoutes = []
      for (let i in modules) {
        const route = modules[i].route
        const mod = modules[i]
        console.log(mod.name)

        const basePath = route === '' ? '/' : route

        if (route === '') noHomeSet = false

        if (mod) {
          const modRoutes = moduleLoaderImports.modules[mod.name].routes
          if (modRoutes) {
            modRoutes.forEach(moduleRoute => {
              moduleRoutes.push(
                <Route
                  path={'/' + path.join(basePath, moduleRoute.path)}
                  key={i}
                  exact
                  render={props => {
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
    { path: '/account', component: AccountPage },
    { path: '/register', component: RegisterPage },
    { path: '/tos', component: TermsOfServicePage },
    { path: '/u/:identifier', component: ProfilePage }
  ].map((route, i) => {
    return (
      <Route
        key={i}
        exact
        path={route.path}
        render={props => {
          return React.createElement(route.component, props)
        }}
      />
    )
  })

  const adminRoutes = [
    <Route
      key={1}
      exact
      path="/admin"
      render={props => {
        return <AdminPage {...props} />
      }}
    />,
    <Route
      key={2}
      exact
      path="/admin/:page"
      render={props => {
        return <AdminPage {...props} />
      }}
    />
  ]

  return (
    <BrowserRouter>
      <ConfigLoader>
        {/* {userNeedsSetup ? (
          <FinishAccountPage />
        ) : ( */}
        <Switch>
          {defaultRoutes}
          {adminRoutes}

          {getModuleRoutes()}

          {noHomeSet && <Route exact path="/" component={NoHomePage}></Route>}

          <Route path="*" component={NotFoundPage}></Route>
        </Switch>
        {/* )} */}
      </ConfigLoader>
    </BrowserRouter>
  )
}

export default connect(state => {
  let userNeedsSetup = false
  if (state.user.username && state.user.identifier !== 'admin') {
    if (!state.user.avatar) {
      userNeedsSetup = true
    }
  }
  return {
    modules: state.modules,
    userNeedsSetup: userNeedsSetup
  }
})(App)
