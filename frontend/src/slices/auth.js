import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";

export const register = createAsyncThunk(
  "auth/register",
  async (signupData, thunkAPI) => {
    try {
      const response = await AuthService.register(signupData);
      return response.data;
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (loginData, thunkAPI) => {
    try {
      const data = await AuthService.login(loginData);
      return { user: data };
    } catch (error) {
      let message = error.response.data.detail || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);


export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    const response = await AuthService.logout();
    return response.data;
  } catch (error) {
    let message = error.response.data.detail || error.response.statusText;

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});



const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

const { reducer } = authSlice;
export default reducer;
