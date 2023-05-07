import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import CoursesService from "../services/courses.service";

export const courses = createAsyncThunk(
  "courses/get",
  async ({ page, pagesize, search }, thunkAPI) => {
    try {
      const response = await CoursesService.getCourses(page, pagesize, search);
      return response.data;
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);




const initialState = {
  data: null
};
const coursesSlice = createSlice({
  name: "courses",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(courses.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(courses.rejected, (state, action) => {
      state.data = null;
    });
  },
});

const { reducer } = coursesSlice;
export default reducer;
