import React from 'react'
import { Card, Avatar, Row, Col, Typography } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export default connect(state => ({ path: state.page.selected }))(
  ({ title, threads, path, currentPath }) => {
    return (
      <Card title={title} bordered={true} style={{ marginBottom: 50 }}>
        {threads.map((thread, i) => (
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
                    <Link to={`${currentPath}/${thread.title}`}>
                      <Typography.Title level={4}>
                        {thread.title}
                      </Typography.Title>
                    </Link>

                    {thread.description}
                  </Col>
                  {thread.lastArticle && (
                    <Col span={4}>
                      <div>
                        <Link
                          to={`${currentPath}/${thread.title}/${thread.lastArticle.title}`}
                        >
                          <Typography.Text strong={true}>
                            {thread.lastArticle.title}
                          </Typography.Text>
                        </Link>
                      </div>
                      <div>
                        <Link to={'/u/' + thread.lastArticle.author.identifier}>
                          {thread.lastArticle.author.username}
                        </Link>
                        , {thread.lastArticle.date.toLocaleDateString()}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        ))}
      </Card>
    )
  }
)
