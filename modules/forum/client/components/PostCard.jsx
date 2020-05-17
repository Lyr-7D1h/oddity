import React, { useState, useEffect } from "react";
import {
  Popconfirm,
  Card,
  Row,
  Col,
  Button,
  Popover,
  Space,
  message,
} from "antd";
import {
  SettingFilled,
  EditFilled,
  DeleteFilled,
  AlertFilled,
} from "@ant-design/icons";
import ReactHtmlParser from "react-html-parser";
import Editor from "Components/Editor";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import hasPermission from "Helpers/hasPermission";
import { Redirect } from "react-router";
import { connect } from "react-redux";

export default connect((state) =>
  ({ user: state.user }(({ post: postProp }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [editPostHtml, setEditPostHtml] = useState("");
    const [editPost, setEditPost] = useState(false);
    const [post, setPost] = useState({});
    const [redirectToThread, setRedirectToThread] = useState(false);

    useEffect(() => {
      setPost(postProp);
    }, [postProp]);

    const handleEditPostSave = () => {
      requester
        .put(`forum/posts/${post.id}`, {
          content: editPostHtml,
        })
        .then((updatedPost) => {
          message.success(`Modified Post ${post.title}`);
          const newPost = post;
          newPost.content = updatedPost.content;
          setPost(newPost);
          setEditPost(false);
          setShowSettings(false);
        })
        .catch((err) => {
          notificationHandler.error(`Could not update post: ${err.message}`);
        });
    };

    const handlePostDelete = () => {
      requester
        .delete(`forum/posts/${post.id}`)
        .then(() => {
          message.success(`${post.title} removed`);
          setRedirectToThread(true);
        })
        .catch((err) => {
          message.error(`Could not remove post: ${err.message}`);
        });
    };

    if (redirectToThread) {
      return <Redirect to=".." />;
    }

    const PostOptions = (
      <Space>
        <Button type="link" danger block>
          <AlertFilled />
          <s>Report</s>
        </Button>
        {hasPermission("MANAGE_FORUM", user) ? (
          <>
            <Button
              onClick={() => {
                setEditPost(true);
                setEditPostHtml(post.content);
              }}
              type="link"
              block
            >
              <EditFilled />
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this post?"
              onConfirm={handlePostDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger block>
                <DeleteFilled />
                Delete
              </Button>
            </Popconfirm>{" "}
          </>
        ) : (
          ""
        )}
      </Space>
    );

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
              {editPost ? (
                <>
                  <Col span={3}>
                    <Button onClick={() => setEditPost(false)} block>
                      Cancel
                    </Button>
                  </Col>
                  <Col span={3}>
                    <Button type="primary" onClick={handleEditPostSave} block>
                      Save
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col span={5} />
                  <Col span={1}>
                    <Popover
                      className="clickable"
                      placement="bottom"
                      trigger="click"
                      content={PostOptions}
                      visible={showSettings}
                      onVisibleChange={() => setShowSettings(!showSettings)}
                    >
                      <SettingFilled />
                    </Popover>
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
  }))
);
