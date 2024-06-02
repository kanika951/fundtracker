import React from "react";
import dayjs from "dayjs";
import "../styles/Admin.css";
import { useState, useEffect } from "react";
import { Space, Table, DatePicker, Tabs, Select, Tag } from "antd";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getRequest, postRequest } from "../../globalService";

function Admin() {
  const dateFormat = "YYYY-MM-DD";
  const myState = useSelector((state) => state.changeTheNumber);
  const [loading, setLoading] = useState(false);
  const [endDate1, setEndDate1] = useState(moment().format());
  const [startDate1, setStartDate1] = useState(
    moment(endDate1).subtract(30, "days").format()
  );
  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);
  const [searchedUser, setSearchedUser] = useState("All");
  const [sortBy, setsortBy] = useState("None");
  const [totalPages, setTotalPages] = useState(7);
  const [options, setOptions] = useState([]);

  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      align: "center",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      sorter: true,
    },
    {
      title: "Contribution Date",
      dataIndex: "contributionDate",
      align: "center",
      sorter: (a, b) => a.contributionDate - b.contributionDate,
      render: (date) => getFullDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (value) => displayStatus(value),
    },
  ];

  const [data, setData] = useState([]);
  const [amountAvailable, setAmountAvailable] = useState();
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
    setLoading(true);
    document.title = "Admin-GTD Fund Tracker";
    setEndDate1(moment().format());
    if (myState == 1) {
    } else {
      navigate("/");
    }

    displayTableData(1, "none", "none", "All", startDate1, endDate1, "All");
    getUsers();
  }, []);

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
    // /*
    //     fetch(
    //       "https://localhost:44305/api/admin/contributions?" +
    //         new URLSearchParams({
    //           Page: pageNumber,
    //           PageSize: 7,
    //           SortBy: sortBy,
    //           SortOrder: sortOrder,
    //           Category: category,
    //         }),
    //       {
    //         method: "post",
    //         body: JSON.stringify({
    //           startDate: startDate,
    //           endDate: endDate,
    //           name: name,
    //         }),
    //         headers: {
    //           Authorization: "Bearer " + localStorage.getItem("token"),
    //           "Content-Type": "application/json",
    //           Accept: "application/json",
    //         },
    //       }
    //     )
    //       .then((res) => res.json())
    //       .then((result) => {
    //         setData(result.data);
    //         setTotalPages(result.totalPages * 7);
    //         setLoading(false);
    //       });
    // */
    const queryParams = {
      Page: pageNumber,
      PageSize: 7,
      SortBy: sortBy,
      SortOrder: sortOrder,
      Category: category,
    };
    const body = {
      startDate: startDate,
      endDate: endDate,
      name: name,
    };

    postRequest("/admin/contributions?", queryParams, true, body).then((result) => {
      // console.log(result);
      setData(result.data);
      setTotalPages(result.totalPages * 7);
      setLoading(false);
    });
  }

  async function getUsers() {
    // const usersResponse = await fetch(
    //   "https://localhost:44305/api/admin/verified-usernames",
    //   {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     console.log(result);
    //     return result;
    //   });

    const usersResponse = await getRequest(
      "/admin/verified-usernames",
      undefined,
      true
    ).then((result) => result);

    const optionValues = usersResponse.map((value, index) => {
      return { label: value, value: value };
    });
    optionValues.unshift({ label: "All", value: "All" });
    setOptions(optionValues);
  }

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");
    return dateAndTime[0].split("-").reverse().join("-");
  };

  const displayStatus = (value) => {
    if (value === "Accepted") {
      return <Tag color="green">{value}</Tag>;
    } else if (value === "Denied") {
      return <Tag color="volcano">{value}</Tag>;
    } else if (value === "Pending") {
      return <Tag color="geekblue">{value}</Tag>;
    }
  };

  const onChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    setStartDate(moment(dateString[0]).format("YYYY-MM-DD"));
    setEndDate(moment(dateString[1]).format("YYYY-MM-DD"));
  };

  const handleUserChange = (value) => {
    setSearchedUser(value);
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
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

  function handleSearchBtn(page) {
    setLoading(true);
    const sortingBy = sortBy.split("-");
    // console.log(sortBy);
    // fetch(
    //   "https://localhost:44305/api/admin/contributions?" +
    //     new URLSearchParams({
    //       Page: page,
    //       PageSize: 7,
    //       SortBy: sortingBy[0],
    //       SortOrder: sortingBy[1],
    //       Category: "All",
    //     }),
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       startDate: startDate,
    //       endDate: endDate,
    //       name: searchedUser,
    //     }),
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     // console.log(result);
    //     setTotalPages(result.totalPages * 7);
    //     setData(result.data);
    //     setLoading(false);
    //   });

    const queryParams = {
      Page: page,
      PageSize: 7,
      SortBy: "none",
      SortOrder: "none",
      Category: "All",
    };
    const body = {
      startDate: startDate,
      endDate: endDate,
      name: searchedUser,
    };

    postRequest("/admin/contributions?", queryParams, true, body)
    .then((result) => {
      // console.log(result);
      setTotalPages(result.totalPages * 7);
        setData(result.data);
        setLoading(false);
    });
  }

  function onTableChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setLoading(true);
    // const sortingBy = sortBy.split("-");
    let sortOrder = "none",
      sortedBy = "none";

    if (sorter.order === "ascend") {
      sortOrder = "Asc";
    } else if (sorter.order === "descend") {
      sortOrder = "Desc";
    }
    if (sorter.field === "amount") {
      sortedBy = "Amount";
    } else if (sorter.field === "contributionDate") {
      sortedBy = "Date";
    }

    displayTableData(
      pagination.current,
      sortedBy,
      sortOrder,
      "All",
      startDate,
      endDate,
      searchedUser
    );
  }

  const onSearch = (value) => {
    console.log("search:", value);
    if (value.length >= 3) {
      displayTableData(1, "none", "none", "All", startDate1, endDate1, value);
    } else if (value.length == 0 || value.length < 3) {
      displayTableData(1, "none", "none", "All", startDate1, endDate1, "All");
    }
  };

  return (
    <>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>

      <Space wrap className="inputoptions" style={{ flexWrap: "nowrap" }}>
        <div className="inputs">
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={onChange}
              onOk={onOk}
              defaultValue={[
                dayjs(startDate1, dateFormat),
                dayjs(endDate1, dateFormat),
              ]}
              format={dateFormat}
            />
          </Space>

          <Select
            showSearch
            placeholder="Select Username"
            optionFilterProp="children"
            style={{
              width: 165,
            }}
            onChange={handleUserChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options}
          />

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
          <div className="contributionStatus">
            {/* <Radio.Group name="radiogroup" defaultValue={1}>
              <Radio value={1}>All</Radio>
              <Radio value={2}>Pending</Radio>
              <Radio value={3}>Accepted</Radio>
              <Radio value={4}>Denied</Radio>
            </Radio.Group> */}
          </div>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onTableChange}
            loading={loading}
            pagination={{
              pageSize: 7,
              total: totalPages,
              onChange: (page) => {
                handleSearchBtn(page);
              },
            }}
          />
          <br />
        </div>
      </div>
    </>
  );
}

export default Admin;
