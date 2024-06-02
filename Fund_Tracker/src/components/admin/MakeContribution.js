import React, { useEffect } from "react";
import ContributionForm from "../ContributionForm";
import { useState } from "react";
import { Space, Tabs, InputNumber } from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/User.css";

function MakeContribution({amountAvailable, setAmountAvailable}) {
  const isRoleValid = useLoaderData();
  // const [amountAvailable, setAmountAvailable] = useState();
  const navigate = useNavigate();

  const tabItems = [
    {
      key: "1",
      label: `View Contributions`,
    },
    {
      key: "2",
      label: `Monthly Fund History`,
    },
    {
      key: "3",
      label: `Add Spending`,
    },
    {
      key: "4",
      label: `Spending History`,
    },
    {
      key: "5",
      label: `Make Contribution`,
    },
    {
      key: "6",
      label: `Manage Requests`,
    },
    {
      key: "7",
      label: `Manage Users`,
    },
  ];
  const onTabChange = (key) => {
    if (key == "1") {
      navigate("/admin");
    }
    if (key == "2") {
      navigate("/admin/month_history");
    }
    if (key == "3") {
      navigate("/admin/add_spending");
    }
    if (key == "4") {
      navigate("/admin/spending_history");
    }
    if (key == "5") {
      navigate("/admin/make_contribution");
    }
    if (key == "6") {
      navigate("/admin/requests");
    }
    if (key == "7") {
      navigate("/admin/manage_users");
    }
  };

  useEffect(() => {
    document.title = "Make Contribution-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
    console.log(amountAvailable);
  }, []);

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="5"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="AdminContributionList--primary">
        <div className="dateInputs">
          <InputNumber
            style={{ display: "none" }}
            id="userId"
            min={1}
            max={200}
            className="amountArea"
            placeholder="Enter User Id"
          />
        </div>
      </Space>
      <hr></hr>
      <ContributionForm amountAvailable={amountAvailable} setAmountAvailable={setAmountAvailable}/>
    </div>
  );
}

export default MakeContribution;
