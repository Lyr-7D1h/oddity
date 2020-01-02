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
      <Col span={6}></Col>
      <Col span={12}>{children}</Col>
      <Col span={6}></Col>
    </Row>
  )
}
