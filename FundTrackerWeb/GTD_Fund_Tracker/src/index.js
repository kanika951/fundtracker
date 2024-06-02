import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import LanguageWrapper from "./LanguageWrapper";
import { Route, Routes, Navigate, createBrowserRouter, RouterProvider,redirect } from "react-router-dom";
import Login from "./components/Login";
import Register from "./Register";
import Admin from "./components/admin/Admin";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Login />,
    loader:()=>{console.log("here from loader")
  return 0;}
  },
  {
    path:"/demo2",
    element:<Register/>,
    loader:()=>{console.log("here from loader")
  return 0;},
  
  },
  {path:"/admin",
            element:<Admin/>
              // myState === 1 ? (
              //   <Admin />
              // ) : (
              //   <Navigate to="/warning/accessdenied" />
              // )
            
          }
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <LanguageWrapper>
            <App />
           </LanguageWrapper>
        </PersistGate>
      </Provider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);
