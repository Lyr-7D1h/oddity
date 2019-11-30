import React from 'react'
import { Spin, Icon, Row, Col, Card } from 'antd'
import { connect } from 'react-redux'
import Centered from './Centered'

const ConfigLoader = ({ config, children }) => {
  if (config.isLoading) {
    const loadIcon = <Icon type="loading" style={{ fontSize: '3em' }} spin />

    return (
      <div style={{ marginTop: '45vh' }}>
        <Centered>
          <Spin delay={100} size="large" indicator={loadIcon} />
        </Centered>
      </div>
    )
  } else {
    document.title = config.title
    return children
  }
}

export default connect(state => ({ config: state.config }))(ConfigLoader)
