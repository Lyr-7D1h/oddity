import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import { setSelected } from './redux/actions/pageActions'

import notificationHandler from './helpers/notificationHandler'

import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import AdminPage from './components/pages/AdminPage'
import ConfigLoader from './components/containers/ConfigLoader'
import RegisterPage from './components/pages/RegisterPage'
import TermsOfServicePage from './components/pages/TermsOfServicePage'
import NotFoundPage from './components/pages/NotFoundPage'
import ForumPage from './components/pages/ForumPage'
import ServersPage from './components/pages/ServersPage'
import MembersPage from './components/pages/MembersPage'
import NoHomePage from './components/pages/NoHomePage'
import AccountPage from './components/pages/AccountPage'
import FinishAccountPage from './components/pages/FinishAccountPage'

import ModulePage from '/home/ivo/p/oddity/modules/example_module/client/components'

const App = ({ modules, routes, userNeedsSetup, dispatch }) => {
  let noHomeSet = true

  const getModuleRoutes = () => {
    if (routes) {
      console.log(routes)
      routes.push({
        name: 'Example',
        path: 'example',
        default: false,
        module: 'example',
        configId: 1
      })
      let moduleRoutes = []
      for (let i in routes) {
        const route = routes[i]
        let component = NotFoundPage

        const path = route.default ? '/' : '/' + route.path

        switch (route.module) {
          case 'example':
            component = ModulePage
            break
          case 'servers':
            component = ServersPage
            break
          case 'forum':
            moduleRoutes = moduleRoutes.concat([
              <Route
                path={path}
                key={i}
                exact
                render={({ location }) => {
                  dispatch(setSelected(location.pathname))
                  return <ForumPage />
                }}
              ></Route>,
              <Route
                path={path + '/:category'}
                key={'category' + i}
                exact
                render={({ location, match }) => {
                  dispatch(setSelected(location.pathname))
                  return <ForumPage category={match.params.category} />
                }}
              ></Route>,
              <Route
                path={path + '/:category/:thread'}
                key={'thread' + i}
                exact
                render={({ location, match }) => {
                  dispatch(setSelected(location.pathname))
                  return (
                    <ForumPage
                      category={match.params.category}
                      thread={match.params.thread}
                    />
                  )
                }}
              ></Route>,
              <Route
                path={path + '/:category/:thread/:post'}
                key={'post' + i}
                exact
                render={({ location, match }) => {
                  dispatch(setSelected(location.pathname))
                  return (
                    <ForumPage
                      category={match.params.category}
                      thread={match.params.thread}
                      post={match.params.post}
                    />
                  )
                }}
              ></Route>
            ])
            continue
          case 'members':
            component = MembersPage
            break
          case 'home':
            component = HomePage
            break
          default:
            console.error(
              `Module ${route.module} is not defined from route: `,
              route
            )
            notificationHandler.error('Modules misconfigured')
        }

        if (route.default) noHomeSet = false

        moduleRoutes.push(
          <Route
            key={i}
            exact
            path={path}
            render={({ location }) => {
              dispatch(setSelected(location.pathname))
              return React.createElement(component, {})
            }}
          ></Route>
        )
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
