import { Card, Col, Row, Anchor } from "antd";
import Breadcrumb from "Components/Breadcrumb";
import Centered from "Components/containers/Centered";
import Page from "Components/containers/Page";
import NotFoundPage from "Components/pages/NotFoundPage";
import notificationHandler from "Helpers/notificationHandler";
import requester from "Helpers/requester";
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateDrafts } from "../../redux/forumActions";

export default connect((state) => ({
  draftCount: state.forum.drafts.length,
  isUser: state.user.id,
  rootPath: state.init.modules.find((mod) => mod.identifier === "forum").route,
}))(({ dispatch, isUser, draftCount, children, notFound, rootPath }) => {
  if (notFound) {
    return <NotFoundPage />;
  }

  // // on page load update drafts
  // useEffect(() => {
  //   requester
  //     .get("forum/drafts")
  //     .then((drafts) => {
  //       dispatch(updateDrafts(drafts));
  //     })
  //     .catch((err) => {
  //       if (err.message !== "Could not find user") {
  //         console.log(err.message);
  //         console.error(err);
  //         notificationHandler.error("Could not fetch drafts", err.message);
  //       }
  //     });
  // }, []);

  return (
    <Page>
      <div style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}>
          <Row>
            <Col span={18}>
              <Breadcrumb />
            </Col>
            <Col span={6}>
              {isUser && (
                <Centered>
                  <Link to={`/${rootPath}/drafts`}>drafts ({draftCount})</Link>
                </Centered>
              )}
            </Col>
          </Row>
        </Card>
      </div>
      <div style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
        {children}
      </div>
    </Page>
  );
});
