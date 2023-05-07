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
      let message = error.response.data.message || error.response.statusText;
      
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
      let message = error.response.data.message || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const generateInvoice = createAsyncThunk(
  "finance/invoice",
  async ({invoiceData}, thunkAPI) => {
    try {
      const response = await ExternalService.generateAnInvoice(invoiceData);
      return response.data;
    } catch (error) {
      let message = error.response.data.message || error.response.statusText;
      
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const getOutstanding = createAsyncThunk(
  "accounts/getoutstanding",
  async ({ account_id }, thunkAPI) => {
    try {
      const response = await ExternalService.getOutstanding(account_id);
      return response.data
    } catch (error) {
      let message = error.response.data.message || error.response.statusText

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);



const initialState = {
  librarySuccess: false,
  financeSuccess: false,
  success: false,
  invData: null,
  outstanding: null,
  outstandingSuccess: false
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
    builder.addCase(generateInvoice.fulfilled, (state, action) => {
      state.success = true;
      state.invData = action.payload;
  });
  builder.addCase(generateInvoice.rejected, (state, action) => {
      state.success = false;
      state.invData = null;
  });
    builder.addCase(getOutstanding.fulfilled, (state, action) => {
      state.outstandingSuccess = true;
      state.outstanding = action.payload;
  });
  builder.addCase(getOutstanding.rejected, (state, action) => {
      state.outstandingSuccess = false;
  });
  },
});

const { reducer } = externalSlice;
export default reducer;
