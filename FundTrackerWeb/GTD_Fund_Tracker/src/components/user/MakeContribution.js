import React from "react";
import { Space, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

function MakeContribution() {
  const navigate = useNavigate();

  const tabItems = [
    {
      key: "1",
      label: `Make Contribution`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `View Contribution History`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `View Pending Dues`,
      children: `Content of Tab Pane 3`,
    },
  ];

  const onTabChange = (key) => {
  };

  return (
    <div className="outerContainer1">
      <div className="innerContainerUser">
        <h1 className="userAppHeading">Welcome Aryan Yadav</h1>
        <br />
        <Space wrap className="contributionList">
          <Tabs defaultActiveKey="1" items={tabItems} onChange={onTabChange} />
        </Space>
      </div>
    </div>
  );
}

export default MakeContribution;
