// import React from "react";
// import "../styles/Admin.css";
// import { useState, useEffect } from "react";
// import { Space, Table, Tabs, InputNumber } from "antd";
// import uuid from "react-uuid";
// import { Button } from "antd";
// import { useNavigate } from "react-router-dom";

// function ContributionByUser() {
//   const [showTable, setShowTable] = useState(false);
//   const [amountAvailable, setAmountAvailable] = useState();
//   const navigate = useNavigate();
//   const [column, setColumn] = useState([
//     {
//       title: "User Name",
//       dataIndex: "userName",
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//     },
//     {
//       title: "Contribution Date",
//       dataIndex: "contributionDate",
//     },
//   ]);
//   const [data, setData] = useState([]);

//   const tabItems = [
//     {
//       key: "1",
//       label: `Monthly Contributors`,
//     },
//     {
//       key: "2",
//       label: `Monthly Fund History`,
//     },
//     {
//       key: "3",
//       label: `Add Spending`,
//     },
//     {
//       key: "4",
//       label: `Contribution By User`,
//     },
//     {
//       key: "5",
//       label: `Make Contribution`,
//     },
//   ];

//   useEffect(() => {
//     document.title = "Contribution By UserId-GTD Fund Tracker";
//     fetch("https://localhost:44305/api/admin/total_fund")
//       .then((res) => res.json())
//       .then((result) => {
//         setAmountAvailable(result);
//       });
//     setShowTable(false);
//   }, []);

//   const onTabChange = (key) => {
//     // navigate('/');
//     if (key == "1") {
//       navigate("/admin");
//     }
//     if (key == "2") {
//       navigate("/admin/month_history");
//     }
//     if (key == "3") {
//       navigate("/admin/add_spending");
//     }
//     if (key == "5") {
//       navigate("/admin/make_contribution");
//     }
//   };

//   function handleSearchBtn() {
//     let userIdEntered = document.getElementById("userId").value;
//     console.log(userIdEntered);
//     fetch(
//       `https://localhost:44305/api/admin/user_contribution/${userIdEntered}`
//     )
//       .then((res) => res.json())
//       .then((result) => {
//         console.log(result);
//         setShowTable(true);
//         setData(result);
//       });
//   }
//   return (
//     <div>
//       <h1 className="userAppHeading">Welcome To GTD Fund Tracker</h1>
//       <br />
//       <Space wrap className="contributionList">
//         <Tabs
//           defaultActiveKey="4"
//           items={tabItems}
//           onChange={onTabChange}
//           className="tabs"
//         />
//       </Space>
//       <Space wrap className="AdminContributionList--primary">
//         <div className="dateInputs">
//           <InputNumber
//             id="userId"
//             min={1}
//             max={200}
//             className="amountArea"
//             placeholder="Enter User Id"
//           />
//           <Button type="primary" onClick={handleSearchBtn}>
//             Search
//           </Button>
//         </div>
//         <p className="heading1">Amount Available : {amountAvailable}</p>
//       </Space>
//       <hr></hr>
//       <div className="formOuterContainer">
//         <div className="formInnerContainer">
//           {showTable ? (
//             <Table
//               key={uuid()}
//               columns={column}
//               dataSource={data}
//               scroll={{ y: 400 }}
//             />
//           ) : (
//             <span> </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ContributionByUser;
