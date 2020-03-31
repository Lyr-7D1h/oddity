import React from 'react'
import Page from '../containers/Page'
import { useEffect } from 'react'
import requester from '../../helpers/requester'
import { useState } from 'react'
import notificationHandler from '../../helpers/notificationHandler'
import UserProfile from '../UserProfile'

export default ({ match }) => {
  const [user, setUser] = useState({})
  const [userNotFound, setUserNotFound] = useState(false)

  useEffect(() => {
    requester
      .get(`users/identifier/${match.params.identifier}`)
      .then(user => {
        if (user) {
          setUser(user)
        } else {
          setUserNotFound(true)
        }
      })
      .catch(err => {
        console.error(err)
        notificationHandler.error('Could not get user', err.message)
      })
  }, [match.params.identifier])

  return (
    <Page>
      {userNotFound ? <> Could not find user </> : <UserProfile user={user} />}{' '}
    </Page>
  )
}
