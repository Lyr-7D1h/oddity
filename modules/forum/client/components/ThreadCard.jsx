import React from "react";
import { Card, Button, Col, Row, Avatar, Typography, Empty } from "antd";
import { Link } from "react-router-dom";

export default ({ thread, threadPath }) => {
  return (
    <>
      <Card
        loading={thread.title ? false : true}
        title={
          <Row>
            <Col span={6}>{thread.title}</Col>
            <Col span={12} />
            <Col span={6}>
              <Link to={`${threadPath}/create`}>
                <Button type="primary" block>
                  Create Post
                </Button>
              </Link>
            </Col>
          </Row>
        }
      >
        {thread.title ? (
          <>
            {thread.posts.length == 0 ? <Empty /> : ""}
            {thread.posts.map((post, i) => (
              <Row type="flex" key={i} className="oddity-category-item">
                <Col
                  span={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Avatar shape="circle" src={post.author.avatar} size={50} />
                </Col>
                <Col span={20}>
                  <div className="oddity-category-item-description">
                    <Row>
                      <Col span={20}>
                        <Link to={`${threadPath}/${post.title}`}>
                          <Typography.Title level={4}>
                            {post.title}
                          </Typography.Title>
                        </Link>
                      </Col>
                      {post && (
                        <Col span={4}>
                          <div>
                            <Link to={"/u/" + post.author.identifier}>
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
          </>
        ) : (
          ""
        )}
      </Card>
    </>
  );
};
