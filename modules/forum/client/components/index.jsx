import React, { useEffect, useState } from "react";
import Page from "@components/containers/Page";
import Breadcrumb from "@components/Breadcrumb";
import Category from "./Category";
import { Card } from "antd";
import Thread from "./Thread";
import Post from "./Post";
import requester from "@helpers/requester";
import notificationHandler from "@helpers/notificationHandler";
import CreatePostForm from "./CreatePostForm";

/**
 * ForumPage
 * @param {string} post - Either title of post or action ("create")
 */
export default ({ currentPath, category, thread, post }) => {
  const [forumItems, setForumItems] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    // check if it is not an action
    if (post !== "create") {
      if (category) {
        // find current id
        let findUrl = `/${category}`;
        if (thread) findUrl += `/${thread}`;
        if (post) findUrl += `/${post}`;

        requester
          .get(`forum/find${findUrl}`)
          .then(result => {
            setCurrentId(result.id);
          })
          .catch(err => {
            notificationHandler.error("Current page not found");
          });
      } else {
        // get home page info
        requester
          .get("forum")
          .then(forum => {
            forum = forum.filter(
              item =>
                !(item.title === "Uncategorized" && item.threads.length === 0)
            );
            setForumItems(forum);
          })
          .catch(err => {
            notificationHandler.error("Could not fetch forum data");
          });
      }
    }
  }, [category, thread, post]);

  let Content = null;

  if (post === "create") {
    Content = <CreatePostForm currentPath={currentPath} threadId={currentId} />;
  }
  if (currentId) {
    if (category && thread && post) {
      Content = <Post currentPath={currentPath} postId={currentId} />;
    } else if (category && thread) {
      Content = <Thread currentPath={currentPath} threadId={currentId} />;
    } else if (category) {
      Content = <Category categoryId={currentId} />;
    }
  } else {
    if (forumItems.length > 0) {
      Content = forumItems.map((category, i) => (
        <Category
          key={i}
          currentPath={currentPath + "/" + category.title}
          category={category}
        />
      ));
    }
  }

  return (
    <Page>
      <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
        <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
          <Breadcrumb />
        </Card>
        <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
          {Content && Content}
        </div>
      </div>
    </Page>
  );
};
