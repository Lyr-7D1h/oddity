import React from 'react'
import { Provider } from 'react-redux'
import store from './store'

export const Initializer = ({ children, modules }) => {
  return <Provider store={store}>{children}</Provider>
}
