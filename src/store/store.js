// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './scheduleSlice'; // استيراد الـ Reducer من السلايس

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer, // هنا نضع اسم الحالة التي سنستخدمها في useSelector
  },
});