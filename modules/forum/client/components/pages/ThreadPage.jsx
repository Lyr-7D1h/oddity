import React, { useState, useEffect } from "react";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import Page from "../containers/Page";
import ThreadCard from "../ThreadCard";

export default ({ match }) => {
  const [thread, setThread] = useState({});
  const [notFound, setNotFound] = useState(false);

  const threadPath = match.url;

  useEffect(() => {
    requester
      .get(`forum/find/${match.params.category}/${match.params.thread}`)
      .then((category) => {
        if (category === null || category.threads.length === 0) {
          setNotFound(true);
        } else {
          setThread(category.threads[0]);
        }
      })
      .catch((err) => {
        notificationHandler.error("Could not fetch thread", err.message);
        console.error(err);
      });
  }, []);

  return (
    <Page notFound={notFound}>
      <ThreadCard thread={thread} threadPath={threadPath} />
    </Page>
  );
};
