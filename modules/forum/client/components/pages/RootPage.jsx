import React, { useEffect, useState } from "react";
import Page from "../containers/Page";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import CategoryCard from "../CategoryCard";
import { Link } from "react-router-dom";
import path from "path";

export default ({ match }) => {
  const [forumItems, setForumItems] = useState([]);

  useEffect(() => {
    // get home page info
    requester
      .get("forum")
      .then((forum) => {
        forum = forum.filter(
          (item) =>
            !(item.title === "Uncategorized" && item.threads.length === 0)
        );
        setForumItems(forum);
      })
      .catch((err) => {
        notificationHandler.error("Could not fetch forum data", err.message);
        console.error(err);
      });
  }, []);

  return (
    <Page>
      {forumItems.map((category, i) => (
        <CategoryCard
          key={i}
          title={
            <Link to={path.join(match.path, category.title)}>
              {category.title}
            </Link>
          }
          category={category}
          categoryPath={path.join(match.url, category.title)}
        />
      ))}
    </Page>
  );
};
