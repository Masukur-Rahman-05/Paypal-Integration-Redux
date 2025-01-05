import { configureStore } from '@reduxjs/toolkit'
import PaymentSlice from './PaymentSlice.js'


export const store = configureStore({
    reducer: {
      paymentSlice:PaymentSlice,
  },
});