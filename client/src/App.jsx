import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import notificationHandler from './helpers/notificationHandler'
import { updatePage } from './redux/actions/pageActions'

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

const App = ({ routes, userNeedsSetup, dispatch }) => {
  let noHomeSet = true

  const WrapperRoute = ({ children, path }) => {
    return (
      <Route
        exact
        path={path}
        render={({ location }) => {
          console.log(location)
          dispatch(updatePage(location.pathname))
          return children
        }}
      />
    )
  }

  const Routes = routes ? (
    <Switch>
      {routes.map((route, i) => {
        let component = NotFoundPage
        switch (route.module) {
          case 'servers':
            component = ServersPage
            break
          case 'forum':
            component = ForumPage
            break
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

        const path = route.default ? '/' : '/' + route.path
        if (route.default) noHomeSet = false
        return <Route key={i} exact path={path} component={component}></Route>
      })}

      {noHomeSet && <Route exact path="/" component={NoHomePage}></Route>}

      <WrapperRoute path="/login">
        <LoginPage></LoginPage>
      </WrapperRoute>
      <Route exact path="/account" component={AccountPage}></Route>
      <Route exact path="/register" component={RegisterPage}></Route>
      <Route exact path="/admin" component={AdminPage}></Route>
      <Route exact path="/tos" component={TermsOfServicePage}></Route>
      <Route path="*" component={NotFoundPage}></Route>
    </Switch>
  ) : (
    ''
  )

  return (
    <BrowserRouter>
      <ConfigLoader>
        {window.location.pathname}
        {userNeedsSetup ? <FinishAccountPage /> : Routes}
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
