import React, { useState } from "react";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { ConfigProvider } from "antd";

import jwt_decode from "jwt-decode";
import Paths from "./PathConfig"
//pages
import Register from "./Register";
import Login from "./components/Login";
import User from "./components/user/User";
import Admin from "./components/admin/Admin";
import UserHeading from "./components/user/UserHeading";
import ViewHistory from "./components/user/ViewHistory";
import ViewPendingDues from "./components/user/ViewPendingDues";
import AdminHeading from "./components/admin/AdminHeading";
import MonthlyFundHistory from "./components/admin/MonthlyFundHistory";
import AddSpending from "./components/admin/AddSpending";
import SpendingHistory from "./components/admin/SpendingHistory";
import Requests from "./components/admin/Requests";
import MakeContribution from "./components/admin/MakeContribution";
import ManageUsers from "./components/admin/ManageUsers";
import AdminNew from "./components/admin/AdminNew";
import MailSentPage from "./components/MailSentPage";
import ConfirmedPage from "./components/ConfirmedPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import SetPasswordPage from "./components/SetPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import PasswordChangedPage from "./components/PasswordChangedPage";
import "./index.css";
import "./cssStyles/navbar.css";
import Demo from "./demo";
import Header from "./components/Header";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("User");
  const [amountAvailable, setAmountAvailable] = useState();
  const [pendingAmount, setPendingAmount] = useState(0);

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

  function adminRoleAuthoriser() {
    const token = jwt_decode(localStorage.getItem("token"));
    if (token.Roles.includes("Admin") && token.Roles.includes("Admin")) {
      return true;
    } else if (token.Roles.includes("Admin")) {
      return true;
    } else {
      return false;
    }
  }

  function userRoleAuthoriser() {
    const token = jwt_decode(localStorage.getItem("token"));
    if (!token.Roles.includes("Admin")) {
      return true;
    } else {
      return false;
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <Header
            amountAvailable={amountAvailable}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        }
      >
        <Route path="/demo" element={<Demo />} />
        <Route
          path={Paths.register}
          element={<Register setUserName={setUserName} />}
        />
        <Route index element={<Login setUserName={setUserName} />} />
        <Route
          path={Paths.adminDashboard}
          element={
            <AdminHeading
              amountAvailable={amountAvailable}
              setAmountAvailable={setAmountAvailable}
            />
            // myState == 1 ? <Admin /> : <Navigate to="/warning/accessdenied" />
          }
        >
          <Route index element={<Admin />} />

          <Route
            path={Paths.adminMonthlyHistory}
            element={
              <MonthlyFundHistory
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />
          <Route
            path= {Paths.adminAddSpending}
            element={
              <AddSpending
                amountAvailable={amountAvailable}
                setAmountAvailable={setAmountAvailable}
              />
            }
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />
          <Route
            path={Paths.adminSpendingHistory}
            element={<SpendingHistory darkMode={darkMode} />}
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />

          <Route
            path={Paths.adminManageRequests}
            element={
              <Requests
                amountAvailable={amountAvailable}
                setAmountAvailable={setAmountAvailable}
              />
            }
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />
          <Route
            path= {Paths.adminMakeContribution}
            element={<MakeContribution amountAvailable={amountAvailable} setAmountAvailable={setAmountAvailable}/>}
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />
          <Route
            path= {Paths.adminManageUsers}
            element={
              <ManageUsers
                amountAvailable={amountAvailable}
                setAmountAvailable={setAmountAvailable}
              />
            }
            loader={() => {
              const ans = adminRoleAuthoriser();
              return ans;
            }}
          />
        </Route>
        <Route
          path={Paths.userDashboard}
          element={
            <UserHeading
              pendingAmount={pendingAmount}
              setPendingAmount={setPendingAmount}
            />
          }
        >
          <Route
            index
            element={<User userName={userName} setUserName={setUserName} />}
          />
          <Route
            path={Paths.userViewHistory}
            element={<ViewHistory />}
            loader={() => {
              const ans = userRoleAuthoriser();
              return ans;
            }}
          />
          <Route
            path={Paths.userViewPending}
            element={<ViewPendingDues />}
            loader={() => {
              const ans = userRoleAuthoriser();
              return ans;
            }}
          />
        </Route>

        <Route path={Paths.adminAgGrid} element={<AdminNew />} />
        <Route path={Paths.mailSentPage} element={<MailSentPage />} />
        <Route path={Paths.mailConfirmedPage} element={<ConfirmedPage />} />
        <Route path={Paths.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={Paths.setPassword} element={<SetPasswordPage />} />
        <Route path={Paths.resetPassword} element={<ResetPasswordPage />} />
        <Route path={Paths.passwordUpdated} element={<PasswordChangedPage />} />
        <Route path={Paths.accessDenied} element={<h1>Access Denied.</h1>} />
        <Route path="*" element={<h1>404 Page Not Found!!!</h1>}/>
      </Route>
    
    )
  );

  return (
    <>
      <div className={`${darkMode ? "dark-theme" : "light-theme"}`}>
        <ConfigProvider
          theme={{
            token: darkMode === true ? darkTheme : "",

            components: darkMode === true ? darkComponents : "",
          }}
        >
          <RouterProvider router={router}></RouterProvider>
        </ConfigProvider>
      </div>
    </>
  );
}

export default App;
