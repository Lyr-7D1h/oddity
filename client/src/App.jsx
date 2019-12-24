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
import MembersPage from './pages/MembersPage'
import NoHomePage from './pages/NoHomePage'
import AccountPage from './pages/AccountPage'
import FinishAccountPage from './pages/FinishAccountPage'
import { setSelected } from './redux/actions/pageActions'

const App = ({ routes, userNeedsSetup, dispatch }) => {
  let noHomeSet = true

  const getModuleRoutes = () => {
    if (routes) {
      let moduleRoutes = []
      for (let i in routes) {
        const route = routes[i]
        let component = NotFoundPage

        const path = route.default ? '/' : '/' + route.path

        switch (route.module) {
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

        console.log(path)

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
    { path: '/admin', component: AdminPage },
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

  return (
    <BrowserRouter>
      <ConfigLoader>
        {userNeedsSetup ? (
          <FinishAccountPage />
        ) : (
          <Switch>
            {defaultRoutes}

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
    userNeedsSetup: userNeedsSetup
  }
})(App)
