import React, { useState, useEffect } from "react";
import requester from "@helpers/requester";
import notificationHandler from "@helpers/notificationHandler";
import Page from "../containers/Page";
import ThreadCard from "../ThreadCard";

export default ({ match }) => {
  const [thread, setThread] = useState({});
  const [notFound, setNotFound] = useState(false);

  const threadPath = match.url;

  useEffect(() => {
    requester
      .get(`forum/find/${match.params.category}/${match.params.thread}`)
      .then(category => {
        if (category === null) {
          setNotFound(true);
        } else {
          setThread(category.threads[0]);
        }
      })
      .catch(err => {
        notificationHandler.error("Could not fetch thread", err.message);
        console.error(err);
      });
  }, []);

  console.log(thread);

  return (
    <Page notFound={notFound}>
      <ThreadCard thread={thread} threadPath={threadPath} />
    </Page>
  );
};
