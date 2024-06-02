import React from "react";
import moment from "moment";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  Space,
  DatePicker,
  Tabs,
  Card,
  Col,
  Row,
  Table,
  Tag,
  Button,
  Modal,
} from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/Admin.css";
import "./styles/monthlyFundHistory.css";
import { getRequest } from "../../globalService";

function MonthlyHistory({ darkMode, setDarkMode }) {
  const isRoleValid = useLoaderData();
  const monthFormat = "YYYY MMM";
  const [inputedDate, setInputedDate] = useState("");
  const [showDate, setShowDate] = useState();
  const [amountCollected, setAmountcollected] = useState();
  const [amountSpent, setAmountSpent] = useState();
  const [amountLeft, setAmountLeft] = useState();
  const [amountAvailable, setAmountAvailable] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(7);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "Month",
      dataIndex: "date",
      align: "center",
      sorter: true,
      render: (value) => {
        return <span>{moment(value).format("MMM  YYYY")}</span>;
      },
    },
    {
      title: "Amount Collected",
      dataIndex: "totalContribution",
      align: "center",
      sorter: true,
      render: (value) => {
        return (
          <span style={{ color: darkMode ? "#54acff" : "blue" }}>{value}</span>
        );
      },
    },
    {
      title: "Amount Spent",
      dataIndex: "totalSpending",
      align: "center",
      sorter: true,
      render: (value) => {
        return (
          <span style={{ color: darkMode ? "#ff5757" : "red" }}>{value}</span>
        );
      },
    },
    {
      title: "Amount Left",
      dataIndex: "remainingFund",
      align: "center",
      sorter: true,
      render: (value) => {
        return (
          <span
            key={value}
            style={{ color: darkMode ? "lightgreen" : "green" }}
          >
            {value}
          </span>
        );
      },
    },
  ];
  //
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

  function displayTableData(page, sortBy, sortOrder, category) {
    setLoading(true);

    const queryParams = {
      Page: page,
      PageSize: 7,
      SortBy: sortBy,
      SortOrder: sortOrder,
      Category: category,
    };

    getRequest("/admin/fund-statement?", queryParams, true).then((result) => {
      // console.log(result);
      setData(result.data);
      setTotalPages(result.totalPages * 7);
      setLoading(false);
    });
  }

  useEffect(() => {
    document.title = "Monthly Fund History-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
    displayTableData(1, "none", "none", "All");
  }, []);

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

  const onDateChange = async (date, dateString) => {
    setInputedDate(dateString);
    // document.querySelectorAll(".fundhistory-monthpicker")[0].innerText =
    //   dateString;
  };

  async function handleSearchBtn() {
    setShowDate(inputedDate);
    // await fetch(
    //   `https://localhost:44305/api/admin/month-fund-details?` +
    //     new URLSearchParams({
    //       date: inputedDate,
    //     }),
    //   {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     console.log(result);

    //     setAmountcollected(result.totalContribution);
    //     setAmountSpent(result.totalSpending);
    //     setAmountLeft(result.remainingFund);
    //   });

    const queryParams = {
      date: inputedDate,
    };
    getRequest("/admin/month-fund-details?", queryParams, true).then((result) => {
      setAmountcollected(result.totalContribution);
      setAmountSpent(result.totalSpending);
      setAmountLeft(result.remainingFund);
    });
  }

  const showModal = () => {
    setIsModalOpen(true);
    handleSearchBtn();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    document.querySelectorAll(".fundhistory-monthpicker")[0].value = "";
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // setInputedDate("");
  };

  function onTableChange(pagination, filters, sorter, extra) {
    // console.log("params", pagination, filters, sorter, extra);
    setLoading(true);
    // const sortingBy = sortBy.split("-");
    let sortOrder = "none",
      sortedBy = "none";

    if (sorter.order === "ascend") {
      sortOrder = "Asc";
    } else if (sorter.order === "descend") {
      sortOrder = "Desc";
    }
    if (sorter.field === "totalContribution") {
      sortedBy = "Collected";
    } else if (sorter.field === "totalSpending") {
      sortedBy = "Spent";
    } else if (sorter.field === "remainingFund") {
      sortedBy = "Left";
    } else if (sorter.field === "date") {
      sortedBy = "Date";
    }

    displayTableData(pagination.current, sortedBy, sortOrder, "All");
  }

  return (
    <>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="2"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="fundhistory-inputlist">
        <div className="fundhistory-dateinputs">
          <DatePicker
            picker="month"
            onChange={onDateChange}
            className="fundhistory-monthpicker"
            placeholder="Select Month and Year"
            defaultValue={inputedDate}
            format={monthFormat}
            // allowClear
          />
          <Button type="primary" onClick={showModal}>
            Search
          </Button>
          <Modal
            title={moment(showDate).format("MMM YYYY")}
            // allowClear:false
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width="36%"
          >
            {/* <h1 className="formHeading">{moment(showDate).format("MMM YYYY")}</h1> */}
            <br />
            <div className="monthlyfund-card">
              <Row gutter={8}>
                <Col span={4}>
                  <Card
                    title="Amount Collected"
                    bordered={true}
                    style={{ width: "100%" }}
                  >
                    {amountCollected}
                  </Card>
                </Col>
                <Col span={4}>
                  <Card title="Amount Spent" bordered={true}>
                    {amountSpent}
                  </Card>
                </Col>
                <Col span={4}>
                  <Card title="Amount Left" bordered={true}>
                    {amountLeft}
                  </Card>
                </Col>
              </Row>
            </div>
          </Modal>
        </div>
        <p className="heading1">Amount Available :{amountAvailable}</p>
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
              // onChange: (page) => {
              //   setLoading(true);
              //   fetch(
              //     `https://localhost:44305/api/admin/fund-statement?` +
              //       new URLSearchParams({
              //         Page: page,
              //         PageSize:7,
              //         SortBy:"none",
              //         SortOrder:"none",
              //         Category:"All"
              //       }),
              //     {
              //       headers: {
              //         Authorization: "Bearer " + localStorage.getItem("token"),
              //         "Content-Type": "application/json",
              //         Accept: "application/json",
              //       },
              //     }
              //   )
              //     .then((res) => res.json())
              //     .then((result) => {

              //       setData(result.data);
              //       setTotalPages(result.totalPages * 7);
              //       setLoading(false);
              //     });
              // },
            }}
          />
          <br />
        </div>
      </div>
    </>
  );
}

export default MonthlyHistory;
