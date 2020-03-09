import React from "react";
import { Card, Avatar, Row, Col, Typography, Empty } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import requester from "../../../../client/src/helpers/requester";
import { connect } from "react-redux";

export default connect(state => ({ basePath: state.page.selected[0] }))(
  ({ category: givenCategory, categoryId, basePath }) => {
    const [category, setCategory] = useState(givenCategory);

    useEffect(() => {
      if (categoryId) {
        requester.get(`forum/categories/${categoryId}`).then(category => {
          setCategory(category);
        });
      }
    }, [categoryId]);

    console.log(category);

    if (!category) {
      return <Empty />;
    }

    basePath = `/${basePath}/${category.title}`;

    return (
      <Card title={category.title} bordered={true} style={{ marginBottom: 50 }}>
        {category.threads.map((thread, i) => (
          <Row type="flex" key={i} className="oddity-category-item">
            <Col
              span={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Avatar shape="square" size={80} icon="read" />
              {/* <Icon type="read" style={{ fontSize: '100%' }}></Icon> */}
            </Col>
            <Col span={20}>
              <div className="oddity-category-item-description">
                <Row>
                  <Col span={20}>
                    <Link to={`${basePath}/${thread.title}`}>
                      <Typography.Title level={4}>
                        {thread.title}
                      </Typography.Title>
                    </Link>

                    {thread.description}
                  </Col>
                  {thread.latestPost[0] && (
                    <Col span={4}>
                      <div>
                        <Link
                          to={`${basePath}/${thread.title}/${thread.latestPost[0].title}`}
                        >
                          <Typography.Text strong={true}>
                            {thread.latestPost[0].title}
                          </Typography.Text>
                        </Link>
                      </div>
                      <div>
                        <Link
                          to={"/u/" + thread.latestPost[0].author.identifier}
                        >
                          {thread.latestPost[0].author.username}
                        </Link>
                        ,{" "}
                        {new Date(
                          thread.latestPost[0].createdAt
                        ).toLocaleDateString()}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        ))}
      </Card>
    );
  }
);
