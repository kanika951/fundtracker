import React from "react";
import dayjs from "dayjs";
import "../styles/Admin.css";
import { useState, useEffect } from "react";
import { Space, Table, DatePicker, Tabs, Select, Tag } from "antd";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Radio } from "antd";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function Admin() {
  const perPage = 8;
  const [gridApi, setGridApi] = useState(null);

  const dateFormat = "YYYY-MM-DD";
  const myState = useSelector((state) => state.changeTheNumber);
  const [loading, setLoading] = useState(false);
  const [endDate1, setEndDate1] = useState(moment().format());
  const [startDate1, setStartDate1] = useState(
    moment(endDate1).subtract(30, "days").format()
  );
  const [options, setOptions] = useState([]);

  const { RangePicker } = DatePicker;
  const [data, setData] = useState([]);
  const [amountAvailable, setAmountAvailable] = useState();
  const navigate = useNavigate();

  const tabItems = [
    {
      key: "0",
      label: `AG-Grid Table`,
    },
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
      label: `Make Contribution`,
    },
    {
      key: "5",
      label: "Manage Requests",
    },
    {
      key: "6",
      label: `Manage Users`,
    },
    // {
    //   key: "7",
    //   label: `Manage Users`,
    // },
  ];

  useEffect(() => {
    setLoading(true);
    document.title = "Admin-GTD Fund Tracker";
    setEndDate1(moment().format());
    if (myState == 1) {
    } else {
      navigate("/");
    }
  //   window.addEventListener('error', e => {
  //     if (e.message === 'ResizeObserver loop limit exceeded') {
  //         const resizeObserverErrDiv = document.getElementById(
  //             'webpack-dev-server-client-overlay-div'
  //         );
  //         const resizeObserverErr = document.getElementById(
  //             'webpack-dev-server-client-overlay'
  //         );
  //         if (resizeObserverErr) {
  //             resizeObserverErr.setAttribute('style', 'display: none');
  //         }
  //         if (resizeObserverErrDiv) {
  //             resizeObserverErrDiv.setAttribute('style', 'display: none');
  //         }
  //     }
  // });
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          console.log(params);
          const page = params.endRow / perPage;
          let category = "All";
          let sortBy = "none",
            sortOrder = "none";
          const { filterModel, sortModel } = params;

          //sorting
          console.log(sortModel);
          if (Object.keys(sortModel).length != 0) {
            sortBy = sortModel[0].colId;
            sortOrder = sortModel[0].sort;
          }

          //Filtering
          if (Object.keys(filterModel).length != 0) {
            if (
              filterModel.status.filter === "Accepted" ||
              filterModel.status.filter === "accepted"
            ) {
              category = "Accepted";
            } else if (
              filterModel.status.filter === "Denied" ||
              filterModel.status.filter === "denied"
            ) {
              category = "Denied";
            } else if (
              filterModel.status.filter === "pending" ||
              filterModel.status.filter === "Pending"
            ) {
              category = "Pending";
            }
          }

          fetch(
            `https://localhost:44305/api/admin/contributions?Page=${page}&PageSize=${8}&SortBy=${sortBy}&SortOrder=${sortOrder}&Category=${category}`,
            {
              method: "post",
              body: JSON.stringify({
                startDate: startDate1,
                endDate: endDate1,
                name: "All",
              }),
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
            .then((resp) => resp.json())
            .then((res) => {
              params.successCallback(res.data, res.totalRecords);
            })
            .catch((err) => {
              params.successCallback([], 0);
            });
        },
      };

      gridApi.setDatasource(dataSource);
    }
  }, [gridApi]);

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
    // if (key == "4") {
    //   navigate("/admin/pending_dues");
    // }
    if (key == "4") {
      navigate("/admin/make_contribution");
    }
    if (key == "5") {
      navigate("/admin/requests");
    }
    if (key == "6") {
      navigate("/admin/manage_users");
    }
  };

  const [rowData] = useState([]);

  const [columnDefs] = useState([
    {
      
      headerName: "Full Name",
      field: "fullName",
      // resizable: true,
      // floatingFilter:true
      suppressMenu: true,
    },
    {
      
      headerName: "User Name",
      field: "userName",
      // resizable: true,
      suppressMenu: true,
    },
    {
      // minWidth : 100,
      headerName: "Amount",
      field: "amount",
      // resizable: true,
      sortable: true,
      suppressMenu: true,
    },
    {
      
      headerName: "Contribution Date",
      field: "contributionDate",
      // resizable: true,
      sortable: true,
      suppressMenu: true,
      cellRendererFramework: (params) => (
        <span>{moment(params.value).format("DD MMM YYYY")}</span>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      // resizable: true,
      floatingFilter: true,
      suppressMenu: true,
      filter: "agTextColumnFilter",
      cellStyle: (params) => displayStatus(params),
    },
  ]);

  const displayStatus = (params) => {
    // console.log(params);
    if (params.value === "Accepted") {
      // console.log("here");
      return { color: "green" };
    } else if (params.value === "Denied") {
      return { color: "red" };
    } else if (params.value === "Pending") {
      return { color: "blue" };
    }
  };

  const defaultColDef = {
    editable: true,
    flex: 1,
    filter: true,
    // floatingFilter:true
  };

  async function getUsers() {
    // const response = await fetch(
    //   "https://localhost:44305/api/admin/users/All",
    //   {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     console.log(result);
    //     return result;
    //   });
    // const usersArray = response.map((value) => {
    //   return value.userName;
    // });
    // const optionValues = usersArray.map((value, index) => {
    //   return { label: value, value: value };
    // });
    // setOptions(optionValues);
  }

  function onGridReady(params) {
    setGridApi(params.api);
    // fetch(
    //   "https://localhost:44305/api/admin/contributions?" +
    //     new URLSearchParams({
    //       Page: 1,
    //       SortBy: "none",
    //       SortOrder: "none",
    //       Category: "All",
    //     }),
    //   {
    //     method: "post",
    //     // mode: "no-cors",
    //     body: JSON.stringify({
    //       startDate: startDate1,
    //       endDate: endDate1,
    //       name: "All",
    //     }),
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     console.log(params);
    //     params.api.applyTransaction({add:result.data});
    //     // setData(result.data);
    //     // setTotalPages(result.totalPages * 7);
    //     // setLoading(false);
    //   });
    // gridOptions.api.sizeColumnsToFit();
    // params.api.sizeColumnsToFit();
  }

  return (
    <>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="0"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <Space wrap className="inputoptions" style={{ flexWrap: "nowrap" }}>
        <div className="inputs">
          <Space direction="vertical" size={12}>
            <RangePicker
              // onChange={onChange}
              // onOk={onOk}
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
            // onChange={handleUserChange}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options}
          />

          <Button
            type="primary"
            onClick={() => {
              // handleSearchBtn(1);
            }}
          >
            Search
          </Button>
        </div>
        <p className="heading1">Amount Available : {amountAvailable}</p>
      </Space>
      <hr></hr>

      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <div className="ag-theme-alpine" style={{ width: "100%", height:"483px" }}>
            <AgGridReact
              // rowData={data}
              // domLayout="autoHeight"
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              rowModelType={"infinite"}
              pagination={true}
              paginationPageSize={perPage}
              cacheBlockSize={perPage}
              defaultColDef={defaultColDef}
              RowModelType="serverSide"
            ></AgGridReact>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
