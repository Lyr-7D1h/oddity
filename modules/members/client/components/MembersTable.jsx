import React, { useEffect, useState } from "react";
import requester from "Helpers/requester";
import notificationHandler from "Helpers/notificationHandler";
import { Table, Avatar } from "antd";
import { Redirect } from "react-router-dom";
import "../styling/membersTable.less";

const columns = [
  {
    title: "",
    dataIndex: "avatar",
    render: (usernameLetter) => (
      <Avatar
        style={{ backgroundColor: "#333", verticalAlign: "middle" }}
        size="large"
      >
        {usernameLetter}
      </Avatar>
    ),
  },
  {
    title: "Username",
    dataIndex: "username",
  },
  {
    title: "ID",
    dataIndex: "identifier",
    render: (id) => (
      <span
        style={{
          backgroundColor: "rgba(0,0,0,.6)",
          padding: "20px",
          paddingTop: "10px",
          paddingBottom: "10px",
          color: "white",
        }}
      >
        {"#" + id}
      </span>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
  },
];

export default () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    requester
      .get("users")
      .then((users) => {
        setMembers(users);
      })
      .catch((err) => {
        notificationHandler.error("Could not fetch Members", err.message);
      });
    requester
      .get("roles")
      .then((roles) => {
        setRoles(roles);
      })
      .catch((err) =>
        notificationHandler.error("Could not fetch Roles", err.message)
      );
  }, []);

  let data = [];
  if (members.length > 0 && roles.length > 0) {
    data = members.map((member) => {
      member.role = roles.find((role) => role.id === member.roleId).name;
      member.avatar = member.username.slice(0, 1).toUpperCase();
      return member;
    });
  }

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <Table
      columns={columns}
      rowClassName="oddity-row"
      onRow={(record, rowIndex) => ({
        onClick: (event) => setRedirectUrl(`/u/${record.identifier}`),
      })}
      dataSource={data}
      pagination={false}
      rowKey="id"
    />
  );
};
