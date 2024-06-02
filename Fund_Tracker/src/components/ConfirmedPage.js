import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setZero } from "../actions";
import { patchRequest } from '../globalService';


const ConfirmedPage = () => {
  const myState = useSelector((state) => state.changeTheNumber);

  const navigate=useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setZero());
    const username = window.location.pathname.split("/").pop();

  //  fetch(`https://localhost:44305/api/account/verify-mail/${username}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8",
  //       },
  //     })
  //       .then((response) => response.text())
  //       .then((json) => {console.log(json);
  //       });
  patchRequest(`/account/verify-mail/${username}`, undefined, false, undefined).then((result)=>{
    console.log(result);
  })
  },[])

  return(
  <Result
    status="success"
    title="Email Verified Successfully"
    subTitle="You can proceed to login."
    extra={[
      <Button type="primary" key="console" onClick={()=>{navigate("/")}}>
        Login
      </Button>,
    ]}
  />
)};
export default ConfirmedPage;