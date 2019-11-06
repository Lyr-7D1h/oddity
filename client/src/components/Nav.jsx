import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

export default ({ selected }) => {
  return (
    <>
      <div className="logo" />
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[selected]}
        style={{ lineHeight: "64px", float: "left" }}
        theme="light"
      >
        <Menu.Item key="1" disabled>
          <Link to="/">ODDITY</Link>
        </Menu.Item>

        <Menu.Item key="2">
          <Link to="/">Blog</Link>
        </Menu.Item>

        <Menu.Item key="3">
          <Link to="/projects">Projects</Link>
        </Menu.Item>

        <Menu.Item key="4">
          <Link to="/learning">Learning Tree</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};
