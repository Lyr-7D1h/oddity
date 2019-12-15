import React from 'react'
import { Card, Icon, Avatar, Row, Col, Typography } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export default connect(state => ({ path: state.page.selected }))(
  ({ title, items, path }) => {
    return (
      <Card title={title} bordered={true} style={{ marginBottom: 50 }}>
        {items.map((item, i) => (
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
                    <Link to={`${path[0]}/${title}/${item.title}`}>
                      <Typography.Title level={4}>
                        {item.title}
                      </Typography.Title>
                    </Link>

                    {item.description}
                  </Col>
                  {item.lastArticle && (
                    <Col span={4}>
                      <div>
                        <Link
                          to={`${path[0]}/${title}/${item.title}/${item.lastArticle.title}`}
                        >
                          <Typography.Text strong={true}>
                            {item.lastArticle.title}
                          </Typography.Text>
                        </Link>
                      </div>
                      <div>
                        <Link to={'/u/' + item.lastArticle.author.identifier}>
                          {item.lastArticle.author.username}
                        </Link>
                        , {item.lastArticle.date.toLocaleDateString()}
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
