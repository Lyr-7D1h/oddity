import React, { useState, useEffect } from 'react'
import { Card, Button, Col, Row, Avatar, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom'
import requester from '../../helpers/requester'
import { connect } from 'react-redux'

export default connect(state => ({ selected: state.page.selected }))(
  ({ selected, threadId }) => {
    console.log(threadId)

    const [thread, setThread] = useState(null)

    useEffect(() => {
      requester.get(`forum/threads/${threadId}`).then(thread => {
        console.log(thread)
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
                <Avatar shape="square" size={80} icon="read" />
                {/* <Icon type="read" style={{ fontSize: '100%' }}></Icon> */}
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

                      {post.description}
                    </Col>
                    {post.lastArticle && (
                      <Col span={4}>
                        <div>
                          <Link
                            to={`${basePath}/${post.title}/${post.lastArticle.title}`}
                          >
                            <Typography.Text strong={true}>
                              {post.lastArticle.title}
                            </Typography.Text>
                          </Link>
                        </div>
                        <div>
                          <Link to={'/u/' + post.lastArticle.author.identifier}>
                            {post.lastArticle.author.username}
                          </Link>
                          , {post.lastArticle.date.toLocaleDateString()}
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
