import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Radio } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise/dist/ag-grid-enterprise.js";

import "./AgGridWrapper.css";
import "ag-grid-enterprise";
const AgGridWrapper = (props) => {
  const [value, setValue] = useState(1);
  const {
    gridApi,
    setGridApi,
    columnDefs,
    rowData,
    onGridReady,
    rowModelType,
    domLayout,
    pagination,
    paginationPageSize,
    cacheBlockSize,
    defaultColDef,
    RowModelType,
    effectFunction,
    effectHelperFunction,
  } = props;
  useEffect(() => {
    console.log("Aggrid here");
    
    effectFunction();
  }, [gridApi]);



  const onRadioChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleExportClick = () => {
    gridApi.exportDataAsCsv();
  };

  
  return (
    <>
      <div className="agwrapper-outer">
        <div className="agwrapper-inner">
          {/* <div className="status-bar">
            <div className="sub-status-bar">
              <span>Transaction Status : &nbsp;</span>
              <Radio.Group onChange={onRadioChange} value={value}>
                <Radio value={1}>{`All(${value})`}</Radio>
                <Radio value={2}>Accepted</Radio>
                <Radio value={3}>Pending</Radio>
                <Radio value={4}>Denied</Radio>
              </Radio.Group>
            </div>
            <span className="exportBtn" onClick={handleExportClick}>
              {<DownloadOutlined />}&nbsp;Export
            </span>
          </div> */}
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", height: "435px" }}
          >
            <AgGridReact
              rowData={rowData}
              
              columnDefs={columnDefs}
              animateRows={true}
              onGridReady={onGridReady}
              rowModelType={rowModelType}
              defaultColDef={defaultColDef}
              RowModelType={RowModelType}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              cacheBlockSize={cacheBlockSize}
             
              enableServerSideSorting={true}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgGridWrapper;
