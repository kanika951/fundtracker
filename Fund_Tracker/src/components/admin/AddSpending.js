import React from "react";
import "../styles/Admin.css";
import { useState, useEffect } from "react";
import {
  Space,
  DatePicker,
  Tabs,
  InputNumber,
  Input,
  Button,
  message,
} from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./styles/addSpending.css";
import axios from "axios";
import { getRequest, postRequest } from "../../globalService";

function AddSpending({ amountAvailable, setAmountAvailable }) {
  const isRoleValid = useLoaderData();
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [reason, setReason] = useState(null);
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

  useEffect(() => {
    document.title = "Add Spending-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
  }, []);

  const success = async () => {
    let reason = document.getElementById("reason").value;

    const body = {
      spendDate: selectedDate,
      amount: amount,
      userName: userName,
      fullName: localStorage.getItem("fullName"),
      usedFor: reason,
    };
    const response = await postRequest(`/admin/add-spending`, undefined, true, body).then((result)=>{
      setSelectedDate(null);
        setAmount(null);
        setReason(null);
        return result;
    });

    if (response) {
      console.log("spending added");
      messageApi.open({
        type: "success",
        content: "The Spending has been added",
        duration: 10,
      });

      getRequest("/admin/total-fund", undefined, true, undefined).then(
        (result) => {
          setAmountAvailable(result);
        }
      );
    }
  };

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

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(dateString);
  };

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="3"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="AdminContributionList--primary">
        <div className="dateInputs"></div>
      </Space>
      <hr></hr>
      <div className="formOuterContainer">
        <div className="formInnerContainer-primary">
          <h1 className="addSpendigHeading">Add Your Spending</h1>
          <br />
          <Space className="spendingFormContainer">
            <DatePicker
              id="spendingdate"
              className="Formcontainer__item"
              onChange={onDateChange}
              placeholder="Select Date"
            />
            <InputNumber
              value={amount}
              id="amountSpent"
              className="spendingAmountArea"
              min={1}
              max={1000}
              placeholder="Enter Amount"
              onChange={(e) => setAmount(e)}
            />
            <Input
              id="reason"
              className="spendingAmountArea"
              placeholder="Reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {contextHolder}
            <Button type="primary" className="pay-btn" onClick={success}>
              Add
            </Button>
          </Space>
          <br />
        </div>
      </div>
    </div>
  );
}

export default AddSpending;
