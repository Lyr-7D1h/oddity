import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import CategoryCard from "../CategoryCard";
import Page from "../containers/Page";
import Drafts from "../Drafts";

export default ({ match }) => {
  return (
    <Page>
      <Drafts />
    </Page>
  );
};
