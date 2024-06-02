import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { getRequest } from "../../globalService";

const UserHeading = ({ pendingAmount, setPendingAmount }) => {
  const [isPendingAmountNegative, setIsPendingAmountNegative] = useState(false);
  const [extraPaid, setExtraPaid] = useState(0);
  
  async function fetchData() {
    let userName = localStorage.getItem("userName");
    getRequest(
      `/user/pending-contribution/${userName}`,
      undefined,
      true,
      undefined
    ).then((result) => {
      if (result < 0) {
        setPendingAmount(0);
        setExtraPaid(result);
        setIsPendingAmountNegative(true);
      } else {
        setPendingAmount(result);
      }
    });
  }

  useEffect(() => {
    document.title = "Pending Dues-GTD Fund Tracker";
    fetchData();
  }, []);

  return (
    <div>
      <Space wrap className="mainheading" style={{ flexWrap: "nowrap" }}>
        <div className="sub-heading">
          <h1 className="userAppHeading" style={{ display: "inline" }}>
            <FormattedMessage
              id="app.heading"
              defaultMessage="Welcome To GTD Fund Tracker"
              values={{ productName: "GTD Fund Tracker" }}
            />
          </h1>
        </div>
        <div className="pending-amount">
          <span className="sub-pending-amount">
            Pending Amount : {pendingAmount}
          </span>
          <br />
          {isPendingAmountNegative ? (
            <span className="pending-amount-text">
              {`(Extra Paid : ₹${extraPaid - 2 * extraPaid})`}{" "}
            </span>
          ) : (
            <span></span>
          )}
        </div>
      </Space>
      <Outlet />
    </div>
  );
};

export default UserHeading;
