import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { connect } from 'react-redux'
import Centered from './Centered'

const ConfigLoader = ({ config, children }) => {
  if (config.isLoading) {
    const loadIcon = <LoadingOutlined style={{ fontSize: '3em' }} spin />

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
