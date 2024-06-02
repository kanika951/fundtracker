import React from "react";
import dayjs from "dayjs";
import { Space, Table, Tabs, Tag, DatePicker, Button } from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { postRequest } from "../../globalService";

function ViewHistory() {
  const navigate = useNavigate();
  const isRoleValid = useLoaderData();
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY-MM-DD";
  const [endDate1, setEndDate1] = useState(moment().format());
  const [startDate1, setStartDate1] = useState(
    moment(endDate1).subtract(30, "days").format()
  );
  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(7);
  const [column, setColumn] = useState([
    {
      title: "Contribution Id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Contribution Date",
      dataIndex: "contributionDate",
      align: "center",
      sorter: true,
      render: (date) => getFullDate(date),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (value) => displayStatus(value),
    },
  ]);
  const [data, setData] = useState([]);
  const tabItems = [
    {
      key: "1",
      label: `Make Contribution`,
    },
    {
      key: "2",
      label: `Contribution History`,
    },
    // {
    //   key: "3",
    //   label: `Pending Dues`,
    // },
  ];

  useEffect(() => {
    document.title = "Contribution History-GTD Fund Tracker";
    if (!isRoleValid) {
      navigate("/warning/accessdenied");
    }
    displayTableData(
      1,
      "none",
      "none",
      "All",
      startDate1,
      endDate1,
      localStorage.getItem("userName")
    );
  }, []);

  const displayStatus = (value) => {
    if (value === "Accepted") {
      return <Tag color="green">{value}</Tag>;
    } else if (value === "Denied") {
      return <Tag color="volcano">{value}</Tag>;
    } else if (value === "Pending") {
      return <Tag color="geekblue">{value}</Tag>;
    }
  };

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");
    return dateAndTime[0].split("-").reverse().join("-");
  };

  const onTabChange = (key) => {
    if (key == "1") {
      navigate("/user");
    }
    if (key == "3") {
      navigate("/user/view_pending");
    }
  };

  function onTableChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setLoading(true);
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
      moment().format(),
      localStorage.getItem("userName")
    );
  }

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

    postRequest(`/user/contributions?`, queryParams, true, body).then(
      (result) => {
        setData(result.data);
        setTotalPages(result.totalPages * 7);
        setLoading(false);
      }
    );
  }

  const handleSearchBtn = (page) => {
    displayTableData(
      page,
      "none",
      "none",
      "All",
      startDate,
      endDate,
      localStorage.getItem("userName")
    );
  };

  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setStartDate(moment(dateString[0]).format("YYYY-MM-DD"));
    setEndDate(moment(dateString[1]).format("YYYY-MM-DD"));
  };

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="2"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <div className="user-history-inputs">
        <Space direction="vertical" size={12}>
          <RangePicker
            onChange={onChange}
            // onOk={onOk}
            defaultValue={[
              dayjs(startDate1, dateFormat),
              dayjs(endDate1, dateFormat),
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
      <hr></hr>
      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <Table
            // key={uuid()}
            columns={column}
            dataSource={data}
            onChange={onTableChange}
            loading={loading}
            pagination={{
              pageSize: 7,
              total: totalPages
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewHistory;
