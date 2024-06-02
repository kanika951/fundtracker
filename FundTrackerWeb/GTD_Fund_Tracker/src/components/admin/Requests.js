import React, { useEffect } from "react";
import { useState } from "react";
import {
  Space,
  Tabs,
  InputNumber,
  Table,
  Button,
  message,
  Popconfirm,
} from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useDispatch, useSelector } from "react-redux";
import { getRequest, patchRequest } from "../../globalService";
import { result } from "lodash";

function Requests({ amountAvailable, setAmountAvailable }) {
  const isRoleValid = useLoaderData();
  const [loading, setLoading] = useState(false);
  const myRequests = useSelector((state) => state.changeRequests);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [column, setColumn] = useState([
    {
      title: "Transaction Id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "userName",
      align: "center",
    },
    {
      title: "Contribution Date",
      dataIndex: "contributionDate",
      align: "center",
      render: (date) => getFullDate(date),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "Action",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <Popconfirm
            title="Accept Request"
            description="Are you sure to Accept this Request?"
            onConfirm={() => handleAcceptConfirmClick(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Accept</Button>
          </Popconfirm>
          <Popconfirm
            title="Deny Request"
            description="Are you sure to Deny this Request?"
            onConfirm={() => handleDenyConfirmClick(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Deny</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]);

  const handleAcceptConfirmClick = async (record) => {
    let body = {
      status: "Accepted",
      remarks: "-",
    };

    const response = await patchRequest(
      `/admin/update-status/${record.id}`,
      undefined,
      true,
      body
    ).then((result) => {
      // console.log(result);
      return result;
    });

    if (response) {
      message.success(`Request Accepted of ${record.userName}`);
      setData((data) => data.filter((item) => item.id !== record.id));

      await getRequest("/admin/total-fund", undefined, true, undefined).then(
        (result) => {
          setAmountAvailable(result);
        }
      );
    } else {
      message.error("Request not Accepted");
    }
  };

  const handleDenyConfirmClick = async (record) => {
    let body={
      status: "Denied",
      remarks: "-",
    };
    const response = await patchRequest(`/admin/update-status/${record.id}`, undefined, true, body).then((result)=>{
      console.log(result);
      return result;
    })

    if (response) {
      message.error(`Request Denied of ${record.userName}`);
      setData((data) => data.filter((item) => item.id !== record.id));
    }
  };

  // const cancel = (e) => {
  //   console.log(e);
  //   message.error("Request Denied");
  // };

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
    document.title = "Make Contribution-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
    const queryParams = {
            Page: 1,
            PageSize: 7,
            SortBy: "none",
            SortOrder: "none",
            Category: "none",
          }
    getRequest("/admin/pending-contributions/All?", queryParams, true, undefined).then((result)=>{
      setData(result.data);
        setLoading(false);
    })
  }, [amountAvailable]);

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");
    return dateAndTime[0].split("-").reverse().join("-");
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

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="6"
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

      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <Table
            key={uuid()}
            columns={column}
            dataSource={data}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Requests;
