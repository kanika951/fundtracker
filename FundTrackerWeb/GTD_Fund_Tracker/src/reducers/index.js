import changeTheNumber from "./changeState";
import changeRequests from "./changeRequests";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    changeTheNumber,
    changeRequests
});

export default rootReducer;