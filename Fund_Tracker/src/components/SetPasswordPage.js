import { Button, Result, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles/PasswordPage.css";
import { useState } from "react";
import { patchRequest } from "../globalService";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");

  async function handleOnClick() {
    const username = window.location.pathname.split("/").pop();

    if (password === "") {
      message.error("Please enter password.");
    } else if (password !== confirmpassword) {
      message.error("Please confirm password.");
    } else {
      const body = {
        username: username,
        newPassword: password,
      };

      const response = await patchRequest(
        `/account/set-password`,
        undefined,
        false,
        body
      ).then((result) => {
        return result;
      });

      if (response === true) {
        navigate("/password-updated");
      } else {
        message.error("Could not reset password. Try again");
      }
    }
  }

  const [form] = Form.useForm();

  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };

  return (
    <div className="password-container">
      <Result
        title="Reset Password"
        subTitle="Please enter your new password."
      />

      <Form
        layout={"horizontal"}
        form={form}
        initialValues={{
          layout: "horizontal",
        }}
        style={{
          width: "20%",
        }}
      >
        <Form.Item
          label=""
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label=""
          name="confirm"
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
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input
            placeholder="Confirm Password"
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item {...buttonItemLayout} className="reset-btn">
          <Button type="primary" onClick={handleOnClick}>
            Set Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SetPasswordPage;
