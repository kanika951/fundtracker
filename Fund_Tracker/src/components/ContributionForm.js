import React from "react";
import { DatePicker, Space, Input, Button, message } from "antd";
import moment from "moment/moment";
import { useSelector, useDispatch } from "react-redux";
import "./styles/ContributionForm.css";
import { getRequest, postRequest } from "../globalService";

function ContributionForm({ amountAvailable, setAmountAvailable }) {
  const myState = useSelector((state) => state.changeTheNumber);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  let inputedMonth;
  let paymentMonthDate;
  let paymentMonth;
  let date = new Date(inputedMonth);
  let momentObj = moment(date);
  let momentString = momentObj.format("YYYY-DD-MM");

  async function handlePaymentClick() {
    let amountEntered = document.getElementById(
      "contributionform--input"
    ).value;

    const body={
            userName: localStorage.getItem("userName"),
            amount: amountEntered,
            contributionDate: momentString,
          }
    const response = await postRequest(`/user/contribute`,undefined, true, body).then((result)=>{
      console.log(result);
        return result;
    }).catch((err) => console.log(err));;

    if (response) {
      if (myState == 1) {
        getRequest("/admin/total-fund", undefined, true, undefined).then(
          (result) => {
            setAmountAvailable(result);
          }
        );
          
        messageApi.open({
          type: "success",
          content: "Contribution Added",
          duration: 3,
        });
      } else if (myState == 2) {
        messageApi.open({
          type: "success",
          content: "Your request has been sent to Admin",
          duration: 3,
        });
      }
      document.getElementById("contributionform--input").value = "";
      document.getElementById("monthPicker").value = "";
    } else {
      message.error("Payment Failed!!!");
      ;
    }
  }

  const onChange = (date, dateString) => {
    let monthMoment = moment(dateString);
    paymentMonth = monthMoment.format("MMM");
    
    inputedMonth = dateString;
    date = new Date(inputedMonth);
    momentObj = moment(date);
    momentString = momentObj.format("YYYY-MM-DD");
    console.log(
      date,
      dateString,
      inputedMonth,
      momentString,
      typeof momentString
    );
  };

  return (
    <>
      <div className="formOuterContainer">
        <div className="formInnerContainer-primary">
          <h1 className="formHeading">Make Your Contribution</h1>
          <br />
          <Space className="ContributionFormContainer">
            <DatePicker
              id="monthPicker"
              className="Formcontainer__item"
              onChange={onChange}
              // picker="month"
              placeholder="YYYY - MM - DD"
            />
            <Input
              id="contributionform--input"
              className="spendingAmountArea"
              placeholder="Enter Amount"
            />
            {contextHolder}
            <Button
              type="primary"
              className="pay-btn"
              onClick={handlePaymentClick}
            >
              Pay
            </Button>
          </Space>
          <br />
        </div>
      </div>
    </>
  );
}

export default ContributionForm;
