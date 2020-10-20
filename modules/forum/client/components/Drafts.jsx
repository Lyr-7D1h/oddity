import notificationHandler from "Helpers/notificationHandler";
import requester from "Helpers/requester";
import toDateTimeString from "Helpers/toDateTimeString";
import { RollbackOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Empty, Space, Table, Card, Button } from "antd";
import DraftsEditingForm from "./DraftsEditingForm";

export default () => {
  const [drafts, setDrafts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState({});

  const updateDrafts = () => {
    requester.get("forum/drafts").then((drafts) => {
      drafts = drafts.map((draft) => {
        draft.createdAt = toDateTimeString(draft.createdAt);
        draft.updatedAt = toDateTimeString(draft.updatedAt);
        return draft;
      });
      setDrafts(drafts);
    });
  };

  const deleteDraft = (id) => {
    requester
      .delete("forum/drafts/" + id)
      .then(() => {
        updateDrafts();
      })
      .catch(() => notificationHandler.error("Could not remove draft"));
  };

  useEffect(() => {
    Promise.all([requester.get("forum/drafts"), requester.get("forum/threads")])
      .then(([drafts, threads]) => {
        drafts = drafts.map((draft) => {
          draft.createdAt = toDateTimeString(draft.createdAt);
          draft.updatedAt = toDateTimeString(draft.updatedAt);
          return draft;
        });
        setDrafts(drafts);
        setThreads(threads);
      })
      .catch((err) => {
        if (err.message !== "Could not find user") {
          console.log(err.message);
          console.error(err);
          notificationHandler.error("Could not fetch drafts", err.message);
        }
      });
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => setSelectedDraft(record)}>Edit</a>
          <a style={{ color: "red" }} onClick={() => deleteDraft(record.id)}>
            Delete
          </a>
        </Space>
      ),
    },
  ];

  if (selectedDraft.id) {
    return (
      <Card title={`Publish ${selectedDraft.title}`}>
        <Button
          onClick={() => {
            updateDrafts();
            setSelectedDraft({});
          }}
          icon={<RollbackOutlined />}
          type="primary"
        >
          Back
        </Button>
        <DraftsEditingForm draft={selectedDraft} threads={threads} />
      </Card>
    );
  }

  return (
    <Card title="Your Drafts">
      {drafts.length === 0 ? (
        <Empty description="You have no drafts" />
      ) : (
        <Table
          pagination={false}
          rowKey="id"
          columns={columns}
          dataSource={drafts}
        />
      )}
    </Card>
  );
};
