import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice";
import authReducer from "../features/auth/authSlice";
import scheduleReducer from "../features/schedule/scheduleSlice";
import patientsReducer from "../features/patients/patientsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    schedule: scheduleReducer,
    patients: patientsReducer,
  },
});
