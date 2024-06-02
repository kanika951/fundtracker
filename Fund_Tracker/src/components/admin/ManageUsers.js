import React from "react";
import { useState, useEffect } from "react";
import {
  Space,
  Tabs,
  Select,
  Table,
  Tag,
  Modal,
  Popconfirm,
  message,
} from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "antd";
// import _, { cloneDeep, sortBy } from "lodash";
import "./styles/pendingDues.css";
import "./styles/manageUsers.css";
import {
  getRequest,
  postRequest,
  patchRequest,
  putRequest,
} from "../../globalService";
import { result } from "lodash";

function ManageUsers() {
  const isRoleValid = useLoaderData();
  const [data, setData] = useState([]);
  const [targetUser, setTargetUser] = useState();
  const [searchedUser, setSearchedUser] = useState();
  const [totalPages, setTotalPages] = useState(7);
  const [currentRoles, setCurrentRoles] = useState();
  const [newRoles, setNewRoles] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deepClone, setDeepClone] = useState();

  const showModal = (record) => {
    console.log("here", record);
    setTargetUser(record.userName);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    const body = {
      userName: targetUser,
      roles: currentRoles,
    };
    const response = await putRequest(`/admin/update-roles`, undefined, true, body).then((result)=>{
      console.log(result);
          return result;
    });

    if (response === true) {
      console.log("Success:", targetUser);
    }

    const queryParams = {
      Page: 1,
      PageSize: 7,
      SortBy: "none",
      SortOrder: "none",
      Category: "none",
    };

    getRequest(`/admin/users/All?`, queryParams, true, undefined).then((result)=>{
      setData(result.data);
    })
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [columns, setColumns] = useState([
    {
      title: "User Name",
      dataIndex: "userName",
      // align: "center",
      render: (value, record) => {
        return (
          <div>
            <a
              style={{ color: "#79ccff" }}
              onClick={() => {
                const userRoles = record.roles.map((role) => {
                  return role.name;
                });
                console.log("UR=>", userRoles);
                setCurrentRoles(userRoles);
                showModal(record);
              }}
            >
              {value}
            </a>
          </div>
        );
      },
    },
    {
      title: "Roles",
      dataIndex: "roles",
      // align: "center",
      render: (value) => {
        return (
          <span>
            {value.map((role) => {
              return <Tag>{role.name}&nbsp;</Tag>;
            })}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      // align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      align: "right",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      align: "right",
      render: (date) => getFullDate(date),
    },
    {
      title: "Pending Amount",
      dataIndex: "pendingAmount",
      align: "right",
      // render: (date) => getFullDate(date),
    },
    {
      title: "Action",
      align: "center",
      render: (record) => (
        <Space size="middle">
          <Popconfirm
            title="Accept Request"
            description="Are you sure to Remove this User?"
            onConfirm={() => handleRemoveConfirmClick(record)}
            onCancel={() => {
              const obj = deepClone;
              console.log(obj);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Disable</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]);

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
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

  async function getUsers() {
    const queryParams = {
      Page: 1,
      pageSize: 7,
      SortBy: "none",
      SortOrder: "none",
      Category: "none",
    };
    getRequest(`/admin/users/All?`, queryParams, true, undefined).then(
      (result) => {
        console.log(result);
        setData(result.data);
        setTotalPages(result.totalPages * 7);
        setLoading(false);
      }
    );

    const usersResponse = await getRequest(
      `/admin/verified-usernames`,
      undefined,
      true,
      undefined
    ).then((result) => {
      // console.log(result);
      return result;
    });

    const optionValues = usersResponse.map((value, index) => {
      return { label: value, value: value };
    });
    optionValues.unshift({ label: "All", value: "All" });
    console.log(optionValues);
    setOptions(optionValues);
  }

  async function displayTableData(page, sortby, sortOrder, category, value) {
    const queryParams = {
      Page: page,
      PageSize: 7,
      SortBy: sortby,
      SortOrder: sortOrder,
      Category: category,
    };
    await getRequest(`/admin/users/${value}?`, queryParams, true, undefined)
      .then((result) => {
        // console.log(result);
        setData(result.data);
        setTotalPages(result.totalPages * 7);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setLoading(true);
    document.title = "Manage Users-GTD Fund Tracker";
    if (isRoleValid === false) {
      navigate("/warning/accessdenied");
    }
    getUsers();
  }, []);

  const handleUsernameChange = (value) => {
    setSearchedUser(value);
    console.log(`selected ${value}`);
  };
  function handleSearchBtn() {
    const queryParams = {
      Page: 1,
      PageSize: 7,
      SortBy: "none",
      SortOrder: "none",
      Category: "All",
    };
    getRequest(
      `/admin/users/${searchedUser}?`,
      queryParams,
      true,
      undefined
    ).then((result) => {
      console.log(result);
      setData(result.data);
    });
  }

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleRoleChange = (value) => {
    setCurrentRoles(value);
    let newArray = newRoles;
    console.log(`selected ${value}`, value, newRoles);
  };

  const handleRemoveConfirmClick = async (record) => {
    const response = patchRequest(
      `/account/deactivate/${record.userName}`,
      undefined,
      true,
      undefined
    )
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));

    if (response) {
      console.log(` ${record.userName} removed`);
      message.success(`${record.userName} removed`);
      setData((data) => data.filter((item) => item.id !== record.id));
    } else {
    }
  };

  function onPageChange(page) {
    setLoading(true);
    const queryParams = {
      Page: page,
      PageSize: 7,
      SortBy: "none",
      SortOrder: "none",
      Category: "none",
    };
    getRequest(`/admin/users/All?`, queryParams, true, undefined)
      .then((result) => {
        console.log(result);
        setData(result.data);
        setTotalPages(result.totalPages * 7);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }

  const onUsernameSearch = (value) => {
    console.log("search:", value);
    if (value.length >= 3) {
      displayTableData(1, "none", "none", "All", value);
    } else if (value.length == 0 || value.length < 3) {
      displayTableData(1, "none", "none", "All", "All");
    }
  };

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="7"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="manageUsersInputs">
        <div className="dateInputs">
          <Select
            showSearch
            placeholder="Select Username"
            optionFilterProp="children"
            style={{
              width: 165,
            }}
            onChange={handleUsernameChange}
            onSearch={onUsernameSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options}
          />
          <Button type="primary" onClick={handleSearchBtn}>
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
            loading={loading}
            pagination={{
              pageSize: 7,
              total: totalPages,
              onChange: (page) => {
                onPageChange(page);
              },
            }}
          />
          <Modal
            title="Edit Roles"
            centered
            defaultValue={"User"}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={handleCancel}
          >
            <hr />
            <h3>{targetUser}</h3>
            <br />
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
                height: "2vh",
              }}
              placeholder="Please select"
              // defaultValue={currentRoles}
              value={currentRoles}
              onChange={handleRoleChange}
              options={roleOptions}
            />
            <br />
            <br />
            <hr />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
