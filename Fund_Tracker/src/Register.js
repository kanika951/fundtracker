import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Checkbox } from "antd";
import uuid from "react-uuid";
import { redirect, useNavigate } from "react-router-dom";
import "./components/styles/Login.css";
import "./register.css";
import moment from "moment";
import { getRequest, postRequest } from "./globalService";
import { result } from "lodash";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Register() {
  const [form] = Form.useForm();
  // const onFinish = (values) => {
  //   console.log("Received values of form: ", values);
  // };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="91">+91</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [usernameArray, setUsernameArray] = useState();
  const [emailArray, setEmailArray] = useState();
  const [phoneNoArray, setPhoneNoArray] = useState();
  // const onFinishFailed = (errorInfo) => {
  //     console.log("Failed:", errorInfo);
  //   };

  useEffect(() => {
    getRequest(`/account/validation-info`, undefined, false, undefined).then(
      (result) => {
        console.log(result);
        setUsernameArray(result.userNames);
        setEmailArray(result.emails);
        setPhoneNoArray(result.phoneNumbers);
      }
    );
  }, []);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const body = {
            email: values.email,
            userName: values.username,
            fullName: values.fullName,
            password: values.password,
            phoneNumber: values.phone,
            designation: values.designation,
            gender: values.gender,
          }

    const response = await postRequest(`/account/register`, undefined, false, body).then((result)=>{
      console.log(result);
        return result;
    }) .catch((err) => console.log(err));

    if (response) {
      messageApi.open({
        type: "success",
        content: "You have been successfully registered",
        duration: 3,
      });
      // setTimeout(()=>{navigate("/mail-sent");},2000);
      navigate("/mail-sent");
    } else {
      alert("Registration Failed!!!");
    }
  };

  return (
    <>
      <div className="register-wrapper">
        <h1 className="register-heading">Register</h1>
        <div className="register-form">
          <Form
            id="register-subform"
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "+91",
            }}
            style={{
              width: "90%",
              margin: "auto",
              paddingRight: "3vw",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="fullName"
              label="FullName"
              rules={[
                {
                  required: true,
                  message: "Please input your fullname!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                  message: "Please select gender!",
                },
              ]}
            >
              <Select placeholder="select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="designation"
              label="Designation"
              rules={[
                {
                  required: true,
                  message: "Please input Designation",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
                {
                  validator(rule, value) {
                    return new Promise(async (resolve, reject) => {
                      let validateEmail = true;

                      for (let name of emailArray) {
                        if (name === value) {
                          validateEmail = false;
                        }
                      }

                      if (validateEmail) {
                        return resolve();
                      } else if (!validateEmail) {
                        reject("Email is already registered");
                      }
                    });
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  validator(rule, value) {
                    return new Promise(async (resolve, reject) => {
                      let validatePhoneNo = true;

                      for (let name of phoneNoArray) {
                        if (name === value) {
                          validatePhoneNo = false;
                        }
                      }

                      if (validatePhoneNo) {
                        return resolve();
                      } else if (!validatePhoneNo) {
                        reject("Phone No. is already registered");
                      }
                    });
                  },
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              tooltip="What do you want others to call you?"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  validator(rule, value) {
                    return new Promise(async (resolve, reject) => {
                      let validateUsername = true;

                      for (let name of usernameArray) {
                        if (name === value) {
                          validateUsername = false;
                        }
                      }

                      if (validateUsername) {
                        return resolve();
                      } else if (!validateUsername) {
                        reject("Username is already taken");
                      }
                    });
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  validator(rule, value) {
                    return new Promise((resolve, reject) => {
                      if (/^([A-Za-z0-9@]\w{7,14})$/.test(value)) {
                        return resolve();
                      } else {
                        reject(
                          "The Password should be alphaNumeric and greater than 7 digits"
                        );
                      }
                    });
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>

            <Form.Item name="agreement" {...tailFormItemLayout}>
              Already have account!!{" "}
              <a
                href=""
                onClick={() => {
                  // redirect("/")
                  navigate("/");
                }}
              >
                Login
              </a>
            </Form.Item>
          </Form>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default Register;
