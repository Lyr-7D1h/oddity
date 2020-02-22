import React from "react";
import Example from "./Example";
import "../styling/css_test.css";
import "../styling/test.less";
import { Route } from "react-router";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div className="module-example-page">
      <h1>Example Page</h1>
      {/* Link to Example which the rout is defined in config.json */}
      <Link to="/example/sub-example">Sub Example</Link>
    </div>
  );
};
