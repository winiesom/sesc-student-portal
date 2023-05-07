import { combineReducers } from "redux";

import authReducer from "./auth";
import messageReducer from "./message";
import coursesReducer from "./courses";
import enrolmentsReducer from "./enrolments";
import profileReducer from "./profile";
import externalReducer from "./external";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  courses: coursesReducer,
  enrolments: enrolmentsReducer,
  profile: profileReducer,
  external: externalReducer
});

export default rootReducer;
