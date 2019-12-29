import React, { useState, useEffect } from 'react'
import { Card, Button, Col, Row } from 'antd'
import requester from '../helpers/requester'

export default ({ threadId }) => {
  const [posts, setPosts] = useState([])

  return (
    <>
      <Card
        title={
          <Row>
            <Col span={6} />
            <Col span={12}>
              <Button type="primary" block>
                Create Post
              </Button>
            </Col>
            <Col span={6} />
          </Row>
        }
      >
        Posts
      </Card>
    </>
  )
}
