import React from "react";
import { Card, Empty } from "antd";
import ReactQuill from "react-quill";

export default ({ post }) => {
  if (!post.title) {
    return <Card loading={true} />;
  } else {
    return (
      <Card
        title={
          <p>
            {post.title}, by {post.author.username}
          </p>
        }
      >
        <ReactQuill defaultValue={post.content} theme={null} readOnly={true} />
      </Card>
    );
  }
};
