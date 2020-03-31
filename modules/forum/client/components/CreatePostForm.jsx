import React, { useState } from "react";
import requester from "../../../../client/src/helpers/requester";
import { Form, Card, Input, Button } from "antd";
import ReactQuill from "react-quill";
import notificationHandler from "../../../../client/src/helpers/notificationHandler";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import path from "path";

export default connect(state => ({ userId: state.user.id }))(
  ({ threadId, userId, threadPath }) => {
    const [postHtml, setPostHtml] = useState([]);
    const [createdPost, setCreatedPost] = useState(false);

    const handleFinish = values => {
      values = {
        ...values,
        content: postHtml,
        threadId: threadId,
        authorId: userId
      };

      requester
        .post(`forum/posts`, values)
        .then(post => {
          setCreatedPost(post);
        })
        .catch(err => {
          notificationHandler.error("Could not send post", err.message);
        });
    };

    const handlePostChange = (html, change, source, editor) => {
      setPostHtml(editor.getContents());
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 0
        }
      }
    };

    if (createdPost) {
      return <Redirect to={path.join(threadPath, createdPost.title)} />;
    }

    return (
      <Card title={"Create new post"} onSubmit={handleFinish}>
        <Form onFinish={handleFinish} {...formItemLayout}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <ReactQuill
            placeholder="Write something..."
            onChange={handlePostChange}
            style={{ marginBottom: "24px" }}
          />
          <Form.Item
            {...tailFormItemLayout}
            className="ant-col-lg-5"
            style={{ margin: 0, float: "right" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Create
            </Button>
          </Form.Item>
          <Form.Item
            {...tailFormItemLayout}
            className="ant-col-lg-5"
            style={{ margin: 0, float: "right" }}
          >
            <Button block>Save as draft</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
);
