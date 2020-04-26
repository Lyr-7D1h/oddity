import React from 'react'
import { Result } from 'antd'
import { connect } from 'react-redux'

const ConfigLoader = ({ init, children }) => {
  if (init.noInit) {
    return (
      <Result
        status="warning"
        title="Could not load initial data"
        subTitle="Something went wrong: please report this incident"
      />
    )
  } else {
    document.title = init.config.title
    return children
  }
}

export default connect((state) => ({ init: state.init }))(ConfigLoader)
