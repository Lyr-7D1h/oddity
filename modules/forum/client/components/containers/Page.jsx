import React from "react";
import Page from "Components/containers/Page";
import Breadcrumb from "Components/Breadcrumb";
import NotFoundPage from "Components/pages/NotFoundPage";
import { Card } from "antd";

export default ({ children, notFound }) => {
  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <Page>
      <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
        <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
          <Breadcrumb />
        </Card>
      </div>
      <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
        {children}
      </div>
    </Page>
  );
};
