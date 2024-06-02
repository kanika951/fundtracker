import React from "react";
import dayjs from "dayjs";
import "../styles/Admin.css";
import { useState, useEffect, useRef } from "react";
import { Space, DatePicker, Tabs, Select } from "antd";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CustomDropdownFilter from "./CustomDropdownFilter";
import AgGridWrapper from "../global/AgGridWrapper";
import { result } from "lodash";

function Admin() {
  const perPage = 8;
  const [gridApi, setGridApi] = useState(null);
  const dateFormat = "YYYY-MM-DD";
  const myState = useSelector((state) => state.changeTheNumber);
  const [endDate1, setEndDate1] = useState(moment().format());
  const [startDate1, setStartDate1] = useState(
    moment(endDate1).subtract(30, "days").format()
  );
  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);
  const [searchedUser, setSearchedUser] = useState("All");
  const [options, setOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [amountAvailable, setAmountAvailable] = useState();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;

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

  const handleFilterChanged = (params) => {
    console.log("Filter changed:", params);
  };

  const defaultColDef = {
    resizable: true,
    // editable: true,
    flex: 1,
  };

  const [columnDefs] = useState([
    {
      headerName: "Full Name",
      field: "fullName",
      suppressMenu: true,
    },
    {
      headerName: "User Name",
      field: "userName",
      suppressMenu: true,
    },
    {
      headerName: "Amount",
      field: "amount",
      sortable: true,
      suppressMenu: true,
    },
    {
      headerName: "Contribution Date",
      field: "contributionDate",
      sortable: true,
      suppressMenu: true,
      cellRenderer: (params) => (
        <span>{moment(params.value).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      // suppressMenu: true,

      // rowGroup:true,
      // hide:true,
      // cellRenderer: 'agGroupCellRenderer',
      // cellRenderer:"agGroupCellRenderer"
      //  enableRowGroup: true;

      filterFramework: CustomDropdownFilter,
      filterParams: {
        filterChangedCallback: handleFilterChanged,
        title: "Select Transaction Status",
      },

      cellStyle: (params) => displayStatus(params),
    },
  ]);

  const displayStatus = (params) => {
    if (params.value === "Accepted") {
      return { color: "green" };
    } else if (params.value === "Denied") {
      return { color: "red" };
    } else if (params.value === "Pending") {
      return { color: "blue" };
    }
  };

  function onGridReady(params) {
    console.log("ready" + params.columnApi.getAllGridColumns());
    setGridApi(params.api);
  }

  function helperFunc(gridApi) {
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
              console.log(res.data);
              // setData(res.data);

              params.successCallback(res.data, res.totalRecords);
            })
            .catch((err) => {
              params.successCallback([], 0);
            });
        },
      };

      gridApi.setDatasource(dataSource);
    }
  }

  useEffect(() => {
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

    helperFunc(gridApi);
    // console.log(data);
    getUsers();
  }, [gridApi]);

  async function getUsers() {
    const response = await fetch(
      "https://localhost:44305/api/admin/verified-usernames",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        return result;
      });

    const optionValues = response.map((value, index) => {
      return { label: value, value: value };
    });
    optionValues.unshift({ label: "All", value: "All" });
    console.log(optionValues);
    setOptions(optionValues);
  }

  const onDatePickerChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setStartDate(moment(dateString[0]).format("YYYY-MM-DD"));
    setEndDate(moment(dateString[1]).format("YYYY-MM-DD"));
  };

  const handleUserChange = (value) => {
    // console.log(value);
    setSearchedUser(value);
  };

  const onDateOk = (value) => {
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
    fetch(
      "https://localhost:44305/api/admin/contributions?" +
        new URLSearchParams({
          Page: 1,
          PageSize:7,
          SortBy: "none",
          SortOrder: "none",
          Category: "All",
        }),
      {
        method: "post",
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          name: "Aryan",
        }),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setRowData(result.data);
      });
    //******************************** */
    // console.log(page);
    // displayTableData(
    //   page,
    //   "none",
    //   "none",
    //   "All",
    //   startDate,
    //   endDate,
    //   searchedUser
    // );
  }

  const onUserSearch = (value) => {
    console.log("search:", value);
    if (value.length >= 3) {
      displayTableData(1, "none", "none", "All", startDate1, endDate1, value);
    } else if (value.length == 0 || value.length < 3) {
      displayTableData(1, "none", "none", "All", startDate1, endDate1, "All");
    }
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
    fetch(
      "https://localhost:44305/api/admin/contributions?" +
        new URLSearchParams({
          Page: pageNumber,
          SortBy: sortBy,
          SortOrder: sortOrder,
          Category: category,
        }),
      {
        method: "post",
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          name: name,
        }),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setRowData(result.data);
      });
  }

  const useEffectFunction = () => {
    // console.log("inside useEffectFunction");
    fetch(
      `https://localhost:44305/api/admin/contributions?Page=${1}&PageSize=${8}&SortBy=${"none"}&SortOrder=${"none"}&Category=${"All"}`,
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
        console.log(res.data);
        // setData(res.data);
        setRowData(res.data);
      });
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
              onChange={onDatePickerChange}
              onOk={onDateOk}
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
            onSearch={onUserSearch}
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
        <p className="heading1">Amount Available : {amountAvailable}</p>
      </Space>
      <hr></hr>

      <AgGridWrapper
        gridApi={gridApi}
        setGridApi={setGridApi}
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        rowModelType={"infinite"}
        pagination={true}
        paginationPageSize={8}
        cacheBlockSize={8}
        defaultColDef={defaultColDef}
        RowModelType={"serverSide"}
        effectFunction={useEffectFunction}
        effectHelperFunction={helperFunc}
      />

      {/* <div className="formOuterContainer">
        <div className="formInnerContainer">
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", height: "483px" }}
          >
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
              onFilterChanged={handleFilterChanged}
            ></AgGridReact>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Admin;
