import React, { Fragment } from "react";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { Button, Form, Input, Result, message } from "antd";
import { redirect, useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { useSelector, useDispatch } from "react-redux";
import { setOne, setTwo } from "../actions";
import "./styles/Login.css";
import { FormattedMessage } from "react-intl";
import { Context } from "../LanguageWrapper";
import { postRequest } from "../globalService";

function Login({ setUserName }) {
  const myState = useSelector((state) => state.changeTheNumber);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login-GTD Fund Tracker";
    if (myState == 1) {
      navigate("/admin");
    } else if (myState == 2) {
      navigate("/user");
    } else {
    }
  });

  const onFinish = async (values) => {
    console.log(values);
    setUserName(values.username);

    {
      const body = {
        userName: values.username,
        password: values.password,
      };

      const response = await postRequest(
        `/account/login`,
        undefined,
        false,
        body
      ).then((result) => {
        const token = jwt_decode(result);
        localStorage.setItem("token", result);
        localStorage.setItem("userName", values.username);
        localStorage.setItem("fullName", token.FullName);
        return token;
      });

      if (response.Roles.includes("Admin")) {
        dispatch(setOne());
        navigate("/admin");
      } else if (!response.Roles.includes("Admin")) {
        dispatch(setTwo());
        navigate("/user");
      } else {
        alert("You are not a valid user");
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h1 className="userAppHeading">
        <FormattedMessage
          id="app.heading"
          defaultMessage="Welcome To GTD Fund Tracker"
          values={{ productName: "GTD Fund Tracker" }}
        />
      </h1>
      <br />
      <div className="loginouter-wrapper">
        <div className="login-inner-wrapper">
          <h1 className="signInHeading">Sign in </h1>
          <div className="login-form">
            <Form
              name="basic"
              className="formContainer"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 19,
              }}
              style={{
                paddingRight: "4vw",
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                key={uuid()}
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                key={uuid()}
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  // {
                  //   validator(rule, value) {
                  //     return new Promise((resolve, reject) => {
                  //       if (/^([A-Za-z]\w{4,14})$/.test(value)) {
                  //         return resolve();
                  //       } else {
                  //         reject(
                  //           "The Password should be alphaNumeric and greater than 5 digits"
                  //         );
                  //       }
                  //     });
                  //   },
                  // },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item className="forgot-password">
                <a className="forgot-password-link" href="/forgot-password">
                  Forgot password?
                </a>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                >
                  Login
                </Button>
                <br />
                <br />
                <div className="login-button-bottom">
                  Not a User?{" "}
                  <a
                    href=""
                    onClick={() => {
                      {
                        navigate("/register");
                      }
                    }}
                  >
                    Register now!
                  </a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
