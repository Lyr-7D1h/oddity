import React, { useState, useEffect } from 'react'
import { Card, Button, Col, Row, Avatar, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom'
import requester from '../../helpers/requester'
import { connect } from 'react-redux'

export default connect(state => ({ selected: state.page.selected }))(
  ({ selected, threadId }) => {
    const [thread, setThread] = useState(null)

    useEffect(() => {
      requester.get(`forum/threads/${threadId}`).then(thread => {
        setThread(thread)
      })
    }, [threadId])

    if (!thread) {
      return <Empty />
    }

    const basePath = '/' + selected.join('/')

    return (
      <>
        <Card
          title={
            <Row>
              <Col span={6}>{thread.title}</Col>
              <Col span={12} />
              <Col span={6}>
                <Link to={`${basePath}/create`}>
                  <Button type="primary" block>
                    Create Post
                  </Button>
                </Link>
              </Col>
            </Row>
          }
        >
          {thread.posts.map((post, i) => (
            <Row type="flex" key={i} className="oddity-category-item">
              <Col
                span={2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Avatar shape="circle" src={post.author.avatar} size={50} />
              </Col>
              <Col span={20}>
                <div className="oddity-category-item-description">
                  <Row>
                    <Col span={20}>
                      <Link to={`${basePath}/${post.title}`}>
                        <Typography.Title level={4}>
                          {post.title}
                        </Typography.Title>
                      </Link>
                    </Col>
                    {post && (
                      <Col span={4}>
                        <div>
                          <Link to={'/u/' + post.author.identifier}>
                            {post.author.username} ({post.author.role.name})
                          </Link>
                          , {new Date(post.updatedAt).toLocaleDateString()}
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          ))}
        </Card>
      </>
    )
  }
)
