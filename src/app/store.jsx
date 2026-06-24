import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice";
import authReducer from "../features/auth/store/authSlice";
import scheduleReducer from "../features/schedule/store/scheduleSlice";
import patientsReducer from "../features/patients/store/patientsSlice";
import appointmentSlice from "../features/appointment/store/appointmentslice";
import profileReducer from "../features/profile/store/profileSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    schedule: scheduleReducer,
    patients: patientsReducer,
    appointment: appointmentSlice,
    profile: profileReducer,
  },
});
