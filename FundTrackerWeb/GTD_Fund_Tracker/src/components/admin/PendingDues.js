import React from "react";
import { useState, useEffect } from "react";
import { Space, Tabs, Select, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./styles/pendingDues.css"

function PendingDues() {
  const [amountAvailable, setAmountAvailable] = useState();
  const [searchedUser, setSearchedUser] = useState();
  const [pendingAmount, setPendingAmount] = useState(0);
  let response;
  const [options, setOptions] = useState([]);
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
      label: `Pending Dues`,
    },
    {
      key: "5",
      label: `Make Contribution`,
    },
    {
      key: "6",
      label: `Requests`,
    },
    {
      key: "7",
      label: `Manage Users`,
    }
  ];
  const onTabChange = (key) => {
    if (key === "1") {
      navigate("/admin");
    }
    if (key === "2") {
      navigate("/admin/month_history");
    }
    if (key === "3") {
      navigate("/admin/add_spending");
    }
    if (key === "5") {
      navigate("/admin/make_contribution");
    }
    if (key === "6") {
      navigate("/admin/requests");
    }
    if (key == "7") {
      navigate("/admin/manage_users");
    }
  };

  async function getUsers() {
    response = await fetch("https://localhost:44305/api/admin/users/All",{
      headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        return result;
      });

      const usersArray = response.map((value) => {
        return value.userName;
      })
    const optionValues = usersArray.map((value, index) => {
      return { label: value, value: value}
    });
    setOptions(optionValues);
  }

  useEffect(() => {
    document.title = "Add Spending-GTD Fund Tracker";
    getUsers();
  }, []);

  const handleChange = (value) => {
    setSearchedUser(value);
    console.log(`selected ${value}`);
  };
  function handleSearchBtn() {
    fetch(
      `https://localhost:44305/api/admin/pending-contribution/${searchedUser}?` +
      new URLSearchParams({
        PageNumber: "1",
        SortBy: "none",
        SortOrder: "none",
        Category:"none"
      }),{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setPendingAmount(result);
      });
  }

  const onSearch = (value) => {
    console.log("search:", value);
  };

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="4"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="pendingInputOptions">
        <div className="dateInputs">
          <Select
            showSearch
            placeholder="Select Username"
            optionFilterProp="children"
            style={{
              width: 165,
            }}
            onChange={handleChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options}
          />
          {/* <Select
              placeholder="Select Username"
              style={{
                width: 165,
              }}
              onChange={handleChange}
              options={options}
            /> */}
          <Button type="primary" onClick={handleSearchBtn}>
            Search
          </Button>
        </div>
        <p className="heading1">Amount Available : {amountAvailable}</p>
      </Space>
      <hr></hr>
      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <div className="fund-card">
            <Card title="Total Pending" bordered={true} style={{ width: 300 }}>
              <p></p>
              <p>{pendingAmount}</p>
              <p></p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingDues;
