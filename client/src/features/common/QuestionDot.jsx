import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default ({ message }) => {
  return (
    <Tooltip title={message}>
      <QuestionCircleOutlined />
    </Tooltip>
  )
}
