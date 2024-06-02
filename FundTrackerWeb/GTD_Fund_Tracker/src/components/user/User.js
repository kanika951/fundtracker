import React, { useEffect } from "react";
import ContributionForm from "../ContributionForm";
import { Space, Tabs} from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Login.css";
import "../styles/User.css";

function User({userName, setUserName}) {
  const myState = useSelector((state) => state.changeTheNumber);
  const profileName=userName;
  const navigate = useNavigate();

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
    setUserName(profileName);
    document.title = "Make Contribution-GTD Fund Tracker";
    if (myState == 2) {
    } else {
      navigate("/");
    }
  }, [userName]);

  const onTabChange = (key) => {
    if (key == "2") {
      console.log();
      navigate("/user/view_history");
    }
    if (key == "3") {
      navigate("/user/view_pending");
    }
  };
  return (
    <div >
        <Space wrap className="contributionList">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            onChange={onTabChange}
            className="tabs"
          />
        </Space>
        <hr></hr>
        <ContributionForm userName={userName}/>
      </div>
  );
}

export default User;
