import React from 'react'
import { Col, Row } from 'antd'

export default ({ children }) => {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ textAlign: 'center' }}
    >
      <Col span={4}></Col>
      <Col span={14}>{children}</Col>
      <Col span={4}></Col>
    </Row>
  )
}
