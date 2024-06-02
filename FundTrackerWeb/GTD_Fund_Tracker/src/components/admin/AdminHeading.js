import React, {useEffect} from 'react'
import { Space, Avatar, Dropdown, message, ConfigProvider } from "antd";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { getRequest } from '../../globalService';


const AdminHeading = ({amountAvailable, setAmountAvailable}) => {
    const myState = useSelector((state) => state.changeTheNumber);

    useEffect(() => {
        getRequest("/admin/total-fund", undefined, true, undefined).then(
          (result) => {
            setAmountAvailable(result);
          })
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
              {myState === 1 ? (
                <p className="amountheading">
                  Amount Available : {amountAvailable}
                </p>
              ) : (
                <span></span>
              )}
            </Space>
            <Outlet/>
    </div>
  )
}

export default AdminHeading