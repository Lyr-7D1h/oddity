import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import path from 'path'

import { connect } from 'react-redux'
import { setSelected } from './redux/actions/pageActions'

import notificationHandler from './helpers/notificationHandler'

import LoginPage from './components/pages/LoginPage'
import AdminPage from './components/pages/AdminPage'
import ConfigLoader from './components/containers/ConfigLoader'
import RegisterPage from './components/pages/RegisterPage'
import TermsOfServicePage from './components/pages/TermsOfServicePage'
import NotFoundPage from './components/pages/NotFoundPage'
import NoHomePage from './components/pages/NoHomePage'
import AccountPage from './components/pages/AccountPage'
import FinishAccountPage from './components/pages/FinishAccountPage'

import moduleLoaderImports from '../module_loader_imports'

// import ModulePage from '/home/ivo/p/oddity/modules/example_module/client/components'

const App = ({ modules, routes, userNeedsSetup, dispatch }) => {
  let noHomeSet = true

  const getModuleRoutes = () => {
    if (routes) {
      let moduleRoutes = []
      for (let i in routes) {
        const route = routes[i]
        // let component = NotFoundPage

        const basePath = route.default ? '/' : route.path

        const mod = modules.find(mod => mod.id === route.moduleId)

        if (route.default) noHomeSet = false

        if (mod) {
          const modRoutes = moduleLoaderImports.routes[mod.name]
          if (modRoutes) {
            modRoutes.forEach(moduleRoute => {
              moduleRoutes.push(
                <Route
                  path={'/' + path.join(basePath, moduleRoute.path)}
                  key={i}
                  exact
                  render={props => {
                    dispatch(setSelected(props.location.pathname))

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
    { path: '/tos', component: TermsOfServicePage }
  ].map((route, i) => {
    return (
      <Route
        key={i}
        exact
        path={route.path}
        render={({ location }) => {
          dispatch(setSelected(location.pathname))
          return React.createElement(route.component, {})
        }}
      />
    )
  })

  const adminRoutes = [
    <Route
      key={1}
      exact
      path="/admin"
      render={({ location }) => {
        dispatch(setSelected(location.pathname))
        return <AdminPage />
      }}
    />,
    <Route
      key={2}
      exact
      path="/admin/:page"
      render={({ location, match }) => {
        dispatch(setSelected(location.pathname))
        return <AdminPage page={match.params.page} />
      }}
    />
  ]

  return (
    <BrowserRouter>
      <ConfigLoader>
        {userNeedsSetup ? (
          <FinishAccountPage />
        ) : (
          <Switch>
            {defaultRoutes}
            {adminRoutes}

            {getModuleRoutes()}

            {noHomeSet && <Route exact path="/" component={NoHomePage}></Route>}

            <Route path="*" component={NotFoundPage}></Route>
          </Switch>
        )}
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
    routes: state.config.routes,
    modules: state.modules,
    userNeedsSetup: userNeedsSetup
  }
})(App)
