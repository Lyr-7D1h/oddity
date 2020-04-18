import React, { useState } from "react";
import { Card, Empty, Row, Col, Button } from "antd";
import { SettingFilled } from "@ant-design/icons";
import ReactHtmlParser from "react-html-parser";
import Editor from "Components/Editor";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";

export default ({ post }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [editPostHtml, setEditPostHtml] = useState("");
  const [editPost, setEditPost] = useState(false);

  const handleEditPostSave = () => {
    requester
      .put(`forum/posts/${post.id}`, {
        content: editPostHtml,
      })
      .then(() => {
        notificationHandler.success(`Modified post ${post.title}`);
      })
      .catch((err) => {
        notificationHandler.error(`Could not update post: ${err.message}`);
      });
  };

  if (!post.title) {
    return <Card loading={true} />;
  } else {
    return (
      <Card
        title={
          <Row>
            <Col span={6}>
              {post.title}, by {post.author.username}
            </Col>
            <Col span={12} />
            {showSettings ? (
              editPost ? (
                <>
                  <Col span={3} />
                  <Col span={3}>
                    <Button type="primary" onClick={handleEditPostSave} block>
                      Save
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col span={3}>
                    <Button
                      onClick={() => setEditPost(true)}
                      type="secondary"
                      block
                    >
                      Edit
                    </Button>
                  </Col>
                  <Col span={3}>
                    <Button type="danger" block>
                      Delete
                    </Button>
                  </Col>
                </>
              )
            ) : (
              <>
                <Col span={5} />
                <Col span={1}>
                  <SettingFilled onClick={() => setShowSettings(true)} />
                </Col>
              </>
            )}
          </Row>
        }
      >
        {editPost ? (
          <Editor
            data={post.content}
            onChange={(html) => setEditPostHtml(html)}
          />
        ) : (
          ReactHtmlParser(post.content)
        )}
      </Card>
    );
  }
};
