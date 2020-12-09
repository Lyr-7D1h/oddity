import React from "react";
import { useEffect } from "react";
import requester from "Helpers/requester";
import { useState } from "react";
import CreatePostForm from "../CreatePostForm";
import Page from "../containers/Page";
import path from "path";
import PostCard from "../PostCard";
import ConditionalRedirect from "Features/common/containers/ConditionalRedirect";
import notificationHandler from "Helpers/notificationHandler";
import { connect } from "react-redux";

export default connect((state) => ({ user: state.user }))(({ user, match }) => {
  const [post, setPost] = useState({});
  const [threadId, setThreadId] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (match.params.post !== "create") {
      requester
        .get(
          `forum/find/${match.params.category}/${match.params.thread}/${match.params.post}`
        )
        .then((category) => {
          if (
            category === null ||
            category.threads.length === 0 ||
            category.threads[0].posts.length === 0
          ) {
            setNotFound(true);
          } else {
            setPost(category.threads[0].posts[0]);
            setThreadId(category.threads[0].id);
          }
        })
        .catch((err) => {
          console.error(err);
          notificationHandler.error("Could not find thread", err.message);
        });
    } else {
      requester
        .get(`forum/find/${match.params.category}/${match.params.thread}`)
        .then((category) => {
          if (category === null || category.threads[0].length === 0) {
            setNotFound(true);
          } else {
            setThreadId(category.threads[0].id);
          }
        })
        .catch((err) => {
          console.error(err);
          notificationHandler.error("Could not find thread", err.message);
        });
    }
  }, [match, user]);

  if (match.params.post === "create" && !user.username) {
    notificationHandler.info("Please login before creating a new post");
  }

  return (
    <Page notFound={notFound}>
      {match.params.post === "create" ? (
        <ConditionalRedirect condition={!user.username} path="/login">
          <CreatePostForm
            threadId={threadId}
            threadPath={path.join(match.url, "..")}
          />
        </ConditionalRedirect>
      ) : (
        <PostCard post={post} />
      )}
    </Page>
  );
});
