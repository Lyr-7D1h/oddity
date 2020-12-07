import { Button, Card, Form, Input, Select } from "antd";
import Editor from "features/common/Editor";
import notificationHandler from "Helpers/notificationHandler";
import requester from "Helpers/requester";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const { Option } = Select;

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
export default ({ draft: draftFromState, threads }) => {
  const [draft, setDraft] = useState(draftFromState);
  const [draftHtml, setDraftHtml] = useState(draftFromState.content);
  const [redirect, setRedirect] = useState("");

  const [form] = Form.useForm();

  const userId = useSelector((state) => state.user.id);

  const handleFinish = (values, isDraft) => {
    values = {
      ...values,
      content: draftHtml,
      authorId: userId,
    };

    if (isDraft) {
      requester
        .put("forum/drafts/" + draft.id, values)
        .then((updatedDraft) => {
          setDraft(updatedDraft);
        })
        .catch(() => notificationHandler.error("Could not update draft"));
    } else {
      requester
        .post("forum/posts", values)
        .then(() => {
          requester
            .delete("forum/drafts/" + draft.id)
            .then(() => {
              setRedirect("");
            })
            .catch(() => notificationHandler.error("Could not delete draft"));
        })
        .catch(() => notificationHandler.error("Could not create post"));
    }
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
    setDraftHtml(html);
    form.setFieldsValue({ content: html });
  };

  if (redirect) {
    <Redirect to="." />;
  }
  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={draft}
      {...formItemLayout}
    >
      <Form.Item label="Thread" name="threadId" rules={[{ required: true }]}>
        <Select>
          {threads.map((thread, i) => (
            <Option key={i} value={thread.id}>
              {thread.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Editor onChange={handleEditorChange} data={draft.content} />
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
          Publish
        </Button>
      </Form.Item>
      <Form.Item
        {...tailFormItemLayout}
        className="ant-col-lg-5"
        style={{ marginTop: "20px", float: "right" }}
      >
        <Button onClick={handleSaveAsDraft} block>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
