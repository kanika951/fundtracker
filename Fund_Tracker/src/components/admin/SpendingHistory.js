import React from "react";
import moment from "moment";
import "../styles/Admin.css";
import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Space, DatePicker, Tabs, Table, Button } from "antd";
import dayjs from "dayjs";
import "./styles/addSpending.css";
import { getRequest, postRequest, patchRequest } from "../../globalService";
import { result } from "lodash";

function SpendingHistory({ darkMode }) {
  const isRoleValid = useLoaderData();
  const dateFormat = "YYYY-MM-DD";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(7);
  const [data, setData] = useState([]);
  const { RangePicker } = DatePicker;
  const [endDateDefault, setEndDate1] = useState(moment().format());
  const [startDateDefault, setStartDate1] = useState(
    moment(endDateDefault).subtract(30, "days").format()
  );

  const [startDate, setStartDate] = useState(startDateDefault);
  const [endDate, setEndDate] = useState(endDateDefault);
  const columns = [
    {
      title: "Spending Date",
      dataIndex: "spendDate",
      align: "center",
      sorter: true,
      render: (value) => getFullDate(value),
    },
    {
      title: "Amount ",
      dataIndex: "amount",
      align: "center",
      sorter: true,
      render: (value) => {
        return (
          <span style={{ color: darkMode ? "#ff4b4b" : "red" }}>{value}</span>
        );
      },
    },
    {
      title: "Used For",
      dataIndex: "usedFor",
      align: "center",
      render: (value) => {
        return (
          <span style={{ color: darkMode ? "lightgreen" : "blue" }}>
            {value}
          </span>
        );
      },
    },
  ];

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

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");
    return dateAndTime[0].split("-").reverse().join("-");
  };

  function displayTableData(
    pageNumber,
    sortBy,
    sortOrder,
    category,
    startDate,
    endDate,
    name
  ) {
    setLoading(true);
    const queryParams = {
      Page: pageNumber,
      pageSize: 7,
      SortBy: sortBy,
      SortOrder: sortOrder,
      Category: category,
    };

    const body = {
      startDate: startDate,
      endDate: endDate,
      name: name,
    };
    postRequest(`/admin/spendings?`, queryParams, true, body).then((result) => {
      setData(result.data);
      setTotalPages(result.totalPages * 7);
      setLoading(false);
    });
  }

  useEffect(() => {
    document.title = "Spending History-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
    displayTableData(
      1,
      "none",
      "none",
      "All",
      startDateDefault,
      endDateDefault,
      "Aryan"
    );
  }, []);

  function onTableChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    let sortOrder = "none",
      sortedBy = "none";

    if (sorter.order === "ascend") {
      sortOrder = "Asc";
    } else if (sorter.order === "descend") {
      sortOrder = "Desc";
    }
    if (sorter.field === "spendDate") {
      sortedBy = "Date";
    } else if (sorter.field === "amount") {
      sortedBy = "Amount";
    }

    displayTableData(
      pagination.current,
      sortedBy,
      sortOrder,
      "All",
      startDate,
      endDate,
      localStorage.getItem("userName")
    );
  }

  const onChange = (value, dateString) => {
    console.log("Formatted Selected Time: ", dateString);
    setStartDate(moment(dateString[0]).format("YYYY-MM-DD"));
    setEndDate(moment(dateString[1]).format("YYYY-MM-DD"));
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  function handleSearchBtn(page) {
    displayTableData(page, "none", "none", "All", startDate, endDate, "All");
  }

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
      <Space
        wrap
        className="inputoptions"
        style={{ flexWrap: "nowrap", paddingLeft: "39vw" }}
      >
        <div className="inputs">
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={onChange}
              onOk={onOk}
              defaultValue={[
                dayjs(startDateDefault, dateFormat),
                dayjs(endDateDefault, dateFormat),
              ]}
              format={dateFormat}
            />
          </Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearchBtn(1);
            }}
          >
            Search
          </Button>
        </div>
      </Space>
      <hr></hr>

      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <Table
            columns={columns}
            dataSource={data}
            onChange={onTableChange}
            loading={loading}
            pagination={{
              pageSize: 7,
              total: totalPages,
            }}
          />
          <br />
        </div>
      </div>
    </div>
  );
}

export default SpendingHistory;
