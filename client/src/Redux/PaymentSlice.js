import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "https://076b-2404-1c40-162-3787-d04d-7d1e-845e-d6c1.ngrok-free.app";

const initialState = {
  paymentError: "",
  paymentSuccess: false,
  paymentStatus: "",
  isLoading: false,
};

export const orderCreate = createAsyncThunk(
  "paymentSlice/orderCreate",
  async ({ cart }, { rejectWithValue }) => {
    try {
      console.log("cart", cart);
      const response = await axios.post(
        `${BASE_URL}/api/orders`,
        { cart },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log("Failed to create order from frontend", error.message);
      rejectWithValue(error.message);
    }
  }
);

export const orderCapture = createAsyncThunk(
  "paymentSlice/orderCapture",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/capture/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Failed to capture payment from frontend", error.message);

      rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "paymentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderCreate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(orderCreate.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderCreate.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderCapture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(orderCapture.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderCapture.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default paymentSlice.reducer;
