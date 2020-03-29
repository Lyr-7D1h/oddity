import React from "react";
import { Card, Row, Col, Avatar, Typography } from "antd";
import { Link } from "react-router-dom";
import { ReadOutlined } from "@ant-design/icons";
import path from "path";

export default ({ category, title, categoryPath }) => {
  return (
    <Card
      title={title}
      loading={!category.title}
      bordered={true}
      style={{ marginBottom: 50 }}
    >
      {category.id
        ? category.threads.map((thread, i) => (
            <Row type="flex" key={i} className="oddity-category-item">
              <Col
                span={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Avatar shape="square" size={80} icon={<ReadOutlined />} />
              </Col>
              <Col span={20}>
                <div className="oddity-category-item-description">
                  <Row>
                    <Col span={20}>
                      <Link to={`${categoryPath}/${thread.title}`}>
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
                            to={`${categoryPath}/${thread.title}/${thread.latestPost[0].title}`}
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
          ))
        : ""}
    </Card>
  );
};
