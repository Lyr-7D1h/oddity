import React from 'react'
import { Provider } from 'react-redux'

import store from './store'

export const Initializer = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}
