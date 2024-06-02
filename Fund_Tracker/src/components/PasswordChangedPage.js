import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PasswordChangedPage = () => {
  const navigate=useNavigate();

  return(
  <Result
    status="success"
    title="Password Changed Successfully"
    subTitle="You can proceed to login."
    extra={[
      <Button type="primary" key="console" onClick={()=>{navigate("/")}}>
        Login
      </Button>,
    ]}
  />
)};
export default PasswordChangedPage;