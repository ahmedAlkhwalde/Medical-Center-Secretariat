import { createSlice } from "@reduxjs/toolkit";

export const WEEK_DAYS = [
  { key: "saturday", label: "السبت" },
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الإثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
];

// خيارات الأطباء (يمكن ملؤها لاحقًا من API)
export const DOCTOR_OPTIONS = [];

const initialState = {
  // قائمة الجداول مخزنة محليًا فقط عند الحاجة (قد لا نحتاجها مع TanStack)
  schedules: [],
  // أي حالات UI إضافية يمكن إضافتها لاحقًا
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    // يمكن إضافة reducers للتحكم بحالة UI إن أردت
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
  },
});

export const { setSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;