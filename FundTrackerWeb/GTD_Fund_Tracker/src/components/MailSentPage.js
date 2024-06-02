import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const MailSentPage = () => { 
  const navigate=useNavigate(); 
  return (
  <Result
    status="success"
    title="Mail has been successfully sent"
    subTitle="Server configuration sometimes takes longer than expected, please wait."
  />
)};
export default MailSentPage;