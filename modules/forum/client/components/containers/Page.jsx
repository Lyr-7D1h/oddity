import React, { useEffect } from "react";
import Page from "Components/containers/Page";
import Breadcrumb from "Components/Breadcrumb";
import NotFoundPage from "Components/pages/NotFoundPage";
import { Card, Alert } from "antd";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import { useDispatch, connect } from "react-redux";
import { updateDrafts, fetchDrafts } from "../../redux/draftActions";

export default connect((state) => ({ draftCount: state.draft.draftCount }))(
  ({ children, draftCount, notFound }) => {
    if (notFound) {
      return <NotFoundPage />;
    }

    if (draftCount === null) {
      const dispatch = useDispatch();
      useEffect(() => {
        dispatch(fetchDrafts());
        requester
          .get("forum/drafts")
          .then((drafts) => {
            dispatch(updateDrafts(drafts));
          })
          .catch((err) => {
            console.error(err);
            notificationHandler.error("Could not fetch drafts", err.message);
          });
      }, []);
    }

    return (
      <Page>
        {draftCount > 0 ? (
          <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
            <Alert
              message={`You have ${draftCount} saved draft${
                draftCount > 1 ? "s" : ""
              }!`}
              description={`Remove or Create a post using these draft${
                draftCount > 1 ? "s" : ""
              } to get rid of this message.`}
              type="info"
              showIcon
              closable
            />
          </div>
        ) : (
          ""
        )}
        <div style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
            <Breadcrumb />
          </Card>
        </div>
        <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
          {children}
        </div>
      </Page>
    );
  }
);
