import React from "react";
import Page from "Components/common/containers/Page";
import MembersTable from "./MembersTable";
import Centered from "Components/common/containers/Centered";
import { Card } from "antd";

export default () => {
  return (
    <Page>
      <Centered>
        <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
          <MembersTable></MembersTable>
        </Card>
      </Centered>
    </Page>
  );
};
