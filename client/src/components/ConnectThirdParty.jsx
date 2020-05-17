import React from 'react'
import { Card, Col, Typography, Row } from 'antd'

export default () => {
  return (
    <>
      <Row style={{ marginBottom: 50 }}>
        <Col span={12}>
          <Card bodyStyle={{ backgroundColor: 'black', color: 'white' }}>
            <Typography.Title level={2} style={{ color: 'white' }}>
              Discord <br />
              Coming soon
            </Typography.Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card bodyStyle={{ backgroundColor: 'black', color: 'white' }}>
            <Typography.Title level={2} style={{ color: 'white' }}>
              Steam <br />
              Coming soon
            </Typography.Title>
          </Card>
        </Col>
      </Row>
    </>
  )
}
