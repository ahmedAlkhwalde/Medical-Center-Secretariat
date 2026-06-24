import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPatient: null, // يحتفظ ببيانات المريض المفتوح حالياً بالتفصيل
};

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    selectPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
  },
});

export const { selectPatient, clearSelectedPatient } = patientsSlice.actions;

export default patientsSlice.reducer;