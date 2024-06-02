import React, { useState, useContext, useEffect } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { Space, Avatar, Dropdown, message, ConfigProvider } from "antd";
import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import DarkThemeToggle from "./DarkThemeToggle";
import logo from "./user/ultimatelogo.png";
import { Context } from "../LanguageWrapper";
import { setZero } from "../actions";
import { FormattedMessage } from "react-intl";

const Header = ({ amountAvailable, darkMode, setDarkMode }) => {
  // const [darkMode, setDarkMode] = useState(false);
  const myState = useSelector((state) => state.changeTheNumber);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClick = ({ key }) => {
    console.log(key);

    if (key === "Sign Out") {
      dispatch(setZero());
      navigate("/");
    } else if (key === "Change Password") {
      navigate("/reset-password");
    } else if (key == "Delete Account") {
      // message.info(`Click on item ${key}`);
    }
  };
  const items = [
    {
      label: "English",
      key: "en-US",
    },
    {
      label: "French",
      key: "fr-BE",
    },
    {
      label: "Arabic",
      key: "ar-DZ",
    },
  ];

  const darkTheme = {
    colorPrimary: "#4076af",
    colorPrimaryBg: "#2a3e52",
    colorBgContainer: "#2a3e52", //background of input
    colorTextBase: "#dceeff",
    colorBgBase: "#20374d",
  };

  const darkComponents = {
    Table: {
      colorBgContainer: "#2a3e52",
    },
    Tabs: {
      colorPrimary: "#dceeff",
      colorBgMask: "red",
    },
  };
  const [theme, setTheme] = useState("light-theme");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  const onChange = () => {
    setDarkMode(!darkMode);
    if (theme === "light-theme" || darkMode === false) {
      setTheme("dark-theme");
    } else if (darkMode === true) {
      setTheme("light-theme");
    }
  };

  return (
    <div>
      <div className={`${darkMode ? "dark-theme" : "light-theme"}`}>
        <ConfigProvider
          theme={{
            token: darkMode === true ? darkTheme : "",

            components: darkMode === true ? darkComponents : "",
          }}
        >
          <div className="userNavbar">
            <div className="logo">
              <img width="172px" src={logo}></img>
              <span className="companyName">GTD Fund Tracker</span>
            </div>

            <div className="profile">
              <div className="sub-profile">
                {myState ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: "Change Password",
                          key: "Change Password",
                        },
                        // {
                        //   label: "Delete Account",
                        //   key: "Delete Account",
                        // },
                        {
                          label: "Sign Out",
                          key: "Sign Out",
                        },
                      ],
                      onClick,
                    }}
                    placement="bottom"
                    arrow={{ pointAtCenter: true }}
                  >
                    <div className="sub-profile-icon">
                      <Avatar
                        size={40}
                        icon={<UserOutlined style={{ fontSize: "130%" }} />}
                      />
                      <span style={{ color: "white" }}>
                        {localStorage.getItem("fullName")}
                      </span>
                      <CaretDownOutlined style={{ color: "white" }} />
                    </div>
                  </Dropdown>
                ) : (
                  <span></span>
                )}
                <div className="header-subcontainer">
                  <Dropdown
                    menu={{
                      items,
                      onClick: ({ key }) => {
                        // message.info(`Click on item ${key}`);
                        // console.log(key);
                        context.selectLanguage(key);
                      },
                    }}
                    placement="bottom"
                    arrow={{ pointAtCenter: true }}
                  >
                    <div className="lang-icon-container">
                      <GlobalOutlined
                        style={{
                          color: "white",
                          fontSize: "210%",
                          paddingTop: "4px",
                          justifyContent: "center",
                        }}
                      />
                      <span
                        style={{
                          color: "white",
                          margin: "auto",
                          textAlign: "center",
                        }}
                      >
                        {context.messages["app.name"]}
                      </span>
                    </div>
                  </Dropdown>
                  <div className="theme-toggle">
                    <label class="switch">
                      <input type="checkbox" onChange={onChange} />
                      <span class="slider"></span>
                    </label>
                    {darkMode ? (
                      <span className="theme-text">Light Mode</span>
                    ) : (
                      <span className="theme-text">Dark Mode</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Header;
