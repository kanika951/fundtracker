import { Button, Result, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles/PasswordPage.css";
import { useState } from "react";
import { getRequest } from "../globalService";


const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  async function handleOnClick() {
    const response = await getRequest(`/account/forgot-password/${username}`, undefined, false, undefined).then((result)=>{
      console.log(result);
      return result;
    })

    if (response === true) {
      navigate("/mail-sent");
    } else {
      message.error("Could not send mail. Please check your username");
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
        title="Trouble logging in?"
        subTitle="Enter your username or email and we'll send you a link on your registered mail to get back into your account."
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
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Email or Username"
            className="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item {...buttonItemLayout} className="proceed-btn-container">
          <Button type="primary" onClick={handleOnClick} className="proceed-btn">
            Proceed
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ForgotPasswordPage;
