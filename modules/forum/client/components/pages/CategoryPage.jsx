import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import requester from "@helpers/requester";
import notificationHandler from "@helpers/notificationHandler";
import CategoryCard from "../CategoryCard";
import Page from "../containers/Page";

export default ({ match }) => {
  const [category, setCategory] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    requester
      .get(`forum/find/${match.params.category}`)
      .then(category => {
        console.log(category);
        if (category === null) {
          setNotFound(true);
        } else {
          console.log(category);
          setCategory(category);
        }
      })
      .catch(err => {
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
