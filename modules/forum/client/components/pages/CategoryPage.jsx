import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import CategoryCard from "../CategoryCard";
import Page from "../containers/Page";

export default ({ match }) => {
  const [category, setCategory] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    requester
      .get(`forum/find/${match.params.category}`)
      .then((category) => {
        if (category === null) {
          setNotFound(true);
        } else {
          setCategory(category);
        }
      })
      .catch((err) => {
        notificationHandler.error("Could not fetch category", err.message);
      });
  }, []);

  return (
    <Page notFound={notFound}>
      <CategoryCard
        title={category.title}
        category={category}
        categoryPath={match.url}
      />
    </Page>
  );
};
