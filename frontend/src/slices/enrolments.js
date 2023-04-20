import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import CoursesService from "../services/courses.service";


export const courseEnrol = createAsyncThunk(
  "courses/enrol",
  async ({ enrolData }, thunkAPI) => {
    try {
      const response = await CoursesService.enrolCourse(enrolData);
      return response.data
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
)

export const getCourseEnrolments = createAsyncThunk(
  "courses/getenrolments",
  async (thunkAPI) => {
    try {
      const response = await CoursesService.getEnrolments();
      return response.data
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
)



const initialState = {
  success: false,
  enrolments: null
};
const enrolmentsSlice = createSlice({
  name: "courses",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(courseEnrol.fulfilled, (state, action) => {
      state.success = true;
    });
    builder.addCase(courseEnrol.rejected, (state, action) => {
      state.success = false;
    });
    builder.addCase(getCourseEnrolments.fulfilled, (state, action) => {
      state.enrolments = action.payload;
    });
    builder.addCase(getCourseEnrolments.rejected, (state, action) => {
      state.enrolments = null;
    });
  },
});

const { reducer } = enrolmentsSlice;
export default reducer;
