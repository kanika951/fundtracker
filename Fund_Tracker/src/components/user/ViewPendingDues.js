import React from "react";
import { Space, Tabs, Card } from "antd";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ViewPendingDues({roleAuth}) {
  const navigate = useNavigate();
  const isRoleValid = useLoaderData();
  console.log(isRoleValid);
  const [response, setResponse] = useState();
  const tabItems = [
    {
      key: "1",
      label: `Make Contribution`,
    },
    {
      key: "2",
      label: `Contribution History`,
    },
    {
      key: "3",
      label: `Pending Dues`,
    },
  ];

  function handleSignOut() {
    navigate("/");
  }

  const onTabChange = (key) => {
    if (key == "1") {
      navigate("/user");
    }
    if (key == "2") {
      navigate("/user/view_history");
    }
  };

  useEffect(() => {
    
    document.title = "Pending Dues-GTD Fund Tracker";
    if(!isRoleValid){
      navigate("/warning/accessdenied")
    }
    async function fetchData() {
      let userName = localStorage.getItem("userName");
      await fetch(
        `https://localhost:44305/api/user/pending-contribution/${userName}`,{
          headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setResponse(result);
          return result;
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <Space wrap className="contributionList">
        <Tabs
          defaultActiveKey="3"
          items={tabItems}
          onChange={onTabChange}
          className="tabs"
        />
      </Space>
      <hr></hr>
      <div className="formOuterContainer">
        <div className="formInnerContainer">
          <div className="fund-card">
            <Card title="Total Pending" bordered={true} style={{ width: 300 }}>
              <p></p>
              <p>{response}</p>
              <p></p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPendingDues;
