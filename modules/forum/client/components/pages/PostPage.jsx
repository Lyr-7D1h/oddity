import React from "react";
import { Card, Empty } from "antd";
import { useEffect } from "react";
import requester from "@helpers/requester";
import { useState } from "react";
import ReactQuill from "react-quill";

export default ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    requester.get(`forum/posts/${postId}`).then(post => {
      setPost(post);
    });
  }, [postId]);

  if (!post) {
    return <Empty />;
  }

  console.log(post);

  return (
    <Card
      title={
        <p>
          {post.title}, by {post.author.username}
        </p>
      }
    >
      <ReactQuill
        defaultValue={post.content}
        theme={null}
        readOnly={true}
      ></ReactQuill>
    </Card>
  );
};
