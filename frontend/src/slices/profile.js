import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ProfileService from "../services/profile.services";

export const profile = createAsyncThunk(
  "profile/get",
  async ({ id }, thunkAPI) => {
    try {
      const response = await ProfileService.getProfile(id);
      return response.data;
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const updateProfile = createAsyncThunk(
    "profile/edit",
    async ({ id, profileData }, thunkAPI) => {
      try {
        const response = await ProfileService.editProfile(id, profileData);
        return response.data;
      } catch (error) {
        let message = error.response.data.detail || error.response.statusText;
        
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue();
      }
    }
  );




const initialState = {
  data: null,
  success: false
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(profile.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(profile.rejected, (state, action) => {
      state.data = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.success = true;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.success = false;
    });
  },
});

const { reducer } = profileSlice;
export default reducer;
