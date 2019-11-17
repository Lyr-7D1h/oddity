import React from 'react'
import { Icon } from 'antd'
import { connect } from 'react-redux'

const ConfigLoader = ({ config, children }) => {
  if (config.isLoading) {
    return <Icon type="loading" />
  } else {
    return children
  }
}

export default connect(state => ({ config: state.config }))(ConfigLoader)
