import React from "react";
import { Card } from "antd";

/**
 * Set on Route /:path_to_example/sub-example
 * Because it is set on a route it will receive react props
 */

export default ({ match, location, history }) => {
  return <Card>EXAMPLE</Card>;
};
