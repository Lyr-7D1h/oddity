import React, { useState } from "react";
import requester from "../../../../client/src/helpers/requester";
import { Form, Card, Input, Button } from "antd";
import notificationHandler from "../../../../client/src/helpers/notificationHandler";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import path from "path";
import Editor from "Components/Editor";
import { useForm } from "antd/lib/form/util";

export default connect((state) => ({ userId: state.user.id }))(
  ({ threadId, userId, threadPath }) => {
    const [postHtml, setPostHtml] = useState([]);
    const [redirect, setRedirect] = useState("");

    const [form] = Form.useForm();

    const handleFinish = (values, isDraft) => {
      values = {
        ...values,
        content: postHtml,
        threadId: threadId,
        authorId: userId,
      };

      const url = isDraft ? "forum/draft" : "forum/posts";

      requester
        .post(url, values)
        .then((post) => {
          if (isDraft) {
            setRedirect(threadPath);
          } else {
            setRedirect(path.join(threadPath, post.title));
          }
        })
        .catch((err) => {
          notificationHandler.error("Could not send post", err.message);
        });
    };

    const handleSaveAsDraft = () => {
      form
        .validateFields()
        .then((values) => handleFinish(values, true))
        .catch((err) => {
          console.error(err);
        });
    };

    const handleEditorChange = (html) => {
      setPostHtml(html);
      form.setFieldsValue({ content: html });
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 0,
        },
      },
    };

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <Card title={"Create new post"} onSubmit={handleFinish}>
        <Form form={form} onFinish={handleFinish} {...formItemLayout}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Editor onChange={handleEditorChange} />
          <Form.Item name="content" rules={[{ required: true }]}>
            <Input hidden />
          </Form.Item>
          <Form.Item
            {...tailFormItemLayout}
            className="ant-col-lg-5"
            style={{ marginTop: "20px", float: "right" }}
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
            style={{ marginTop: "20px", float: "right" }}
          >
            <Button onClick={handleSaveAsDraft} block>
              Save as draft
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
);
