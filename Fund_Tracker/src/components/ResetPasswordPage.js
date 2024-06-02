import { Button, Result, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles/PasswordPage.css";
import { useState } from "react";
import { patchRequest } from "../globalService";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  async function handleOnClick() {
    if (newPass === "") {
      message.error("Please set a new password.");
    } else if (oldPass === newPass) {
      message.error("New password cannot be same as old password.");
    } else {
      const body = {
        userName: localStorage.getItem("userName"),
        oldPassword: oldPass,
        newPassword: newPass,
      };
      const response = await patchRequest(`/account/reset-password`, undefined, true, body).then((result)=>{
        console.log(result);
        return result;
      });

      if (response === true) {
        message.success("Password changed successfully.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
        subTitle="Please enter your Old and New password."
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
          name="oldpassword"
          rules={[
            {
              required: true,
              message: "Please input your old password!",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Old Password"
            onChange={(e) => setOldPass(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label=""
          name="newpassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
          ]}
        >
          <Input
            placeholder="New Password"
            onChange={(e) => setNewPass(e.target.value)}
          />
        </Form.Item>
        <Form.Item {...buttonItemLayout} className="reset-btn-container">
          <Button type="primary" onClick={handleOnClick} className="reset-btn">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
