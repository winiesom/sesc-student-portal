import { combineReducers } from "redux";

import authReducer from "./auth";
import messageReducer from "./message";
import coursesReducer from "./courses";
import enrolmentsReducer from "./enrolments";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  courses: coursesReducer,
  enrolments: enrolmentsReducer,
});

export default rootReducer;
