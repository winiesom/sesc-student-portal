import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import ExternalService from "../services/external.services";

export const libraryRegister = createAsyncThunk(
  "library/register",
  async (librarySignupData, thunkAPI) => {
    try {
      const response = await ExternalService.registerLibrary(librarySignupData);
      return response.data;
    } catch (error) {
        console.log(error)
      let message;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const financeRegister = createAsyncThunk(
  "finance/register",
  async (financeSignupData, thunkAPI) => {
    try {
      const response = await ExternalService.registerFinance(financeSignupData);
      return response.data;
    } catch (error) {
        console.log(error)
      let message;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);



const initialState = {
  librarySuccess: false,
  financeSuccess: false
};
const externalSlice = createSlice({
  name: "external",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(libraryRegister.fulfilled, (state, action) => {
        state.librarySuccess = true;
    });
    builder.addCase(libraryRegister.rejected, (state, action) => {
        state.librarySuccess = false;
    });
    builder.addCase(financeRegister.fulfilled, (state, action) => {
        state.financeSuccess = true;
    });
    builder.addCase(financeRegister.rejected, (state, action) => {
        state.financeSuccess = false;
    });
  },
});

const { reducer } = externalSlice;
export default reducer;
