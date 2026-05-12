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

export const DOCTOR_OPTIONS = [
  {
    id: "doc-1",
    name: "د. أحمد علي",
    specialization: "العينية",
    clinic: "العيادة العينية",
  },
  {
    id: "doc-2",
    name: "د. منى سعيد",
    specialization: "الجلدية",
    clinic: "عيادة الجلدية",
  },
  {
    id: "doc-3",
    name: "د. سامر يوسف",
    specialization: "الأطفال",
    clinic: "عيادة الأطفال",
  },
  {
    id: "doc-4",
    name: "د. رنا الخطيب",
    specialization: "القلبية",
    clinic: "عيادة القلب",
  },
  {
    id: "doc-5",
    name: "د. ليان محمود",
    specialization: "النسائية والتوليد",
    clinic: "عيادة النساء",
  },
  {
    id: "doc-6",
    name: "د. فهد إبراهيم",
    specialization: "العظام",
    clinic: "عيادة العظام",
  },
];

const initialState = {
  schedules: [
    {
      id: 1,
      doctorId: "doc-1",
      doctor: {
        name: "د. أحمد علي",
        specialization: "العينية",
        clinic: "العيادة العينية",
      },
      weeklySchedule: {
        saturday: [{ start: "09:00", end: "13:00", label: "صباحي" }],
        monday: [{ start: "14:00", end: "18:00", label: "مسائي" }],
        wednesday: [{ start: "10:00", end: "14:00", label: "عمليات" }],
        thursday: [{ start: "16:00", end: "20:00", label: "متابعة" }],
      },
      statusNote:
        "يستقبل الحالات المحولة بعد الظهر ويغطي مراجعات العمليات يوم الأربعاء.",
    },
    {
      id: 2,
      doctorId: "doc-2",
      doctor: {
        name: "د. منى سعيد",
        specialization: "الجلدية",
        clinic: "عيادة الجلدية",
      },
      weeklySchedule: {
        sunday: [{ start: "08:30", end: "12:30", label: "مراجعات" }],
        tuesday: [{ start: "13:00", end: "17:00", label: "إجراءات" }],
        friday: [{ start: "10:00", end: "14:00", label: "عيادة مفتوحة" }],
      },
      statusNote:
        "دوام مرن موزع على ثلاثة أيام مع نافذة إضافية للحالات السريعة يوم الجمعة.",
    },
    {
      id: 3,
      doctorId: "doc-3",
      doctor: {
        name: "د. سامر يوسف",
        specialization: "الأطفال",
        clinic: "عيادة الأطفال",
      },
      weeklySchedule: {
        saturday: [{ start: "14:00", end: "19:00", label: "مسائي" }],
        monday: [{ start: "09:00", end: "13:00", label: "صباحي" }],
        wednesday: [{ start: "09:00", end: "13:00", label: "صباحي" }],
        thursday: [{ start: "09:00", end: "12:00", label: "متابعة" }],
      },
      statusNote:
        "يوازن بين دوامات صباحية ومسائية لتغطية أكبر عدد من الزيارات العائلية.",
    },
    {
      id: 4,
      doctorId: "doc-4",
      doctor: {
        name: "د. رنا الخطيب",
        specialization: "القلبية",
        clinic: "عيادة القلب",
      },
      weeklySchedule: {
        sunday: [{ start: "15:00", end: "20:00", label: "مسائي" }],
        tuesday: [{ start: "09:00", end: "13:00", label: "فحص" }],
        thursday: [{ start: "14:00", end: "18:00", label: "مراجعات" }],
      },
      statusNote:
        "دوام مركز على الأيام ذات الضغط الأعلى مع جلسات متابعة بعد الظهر.",
    },
  ],
  nextId: 5,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    addSchedule: (state, action) => {
      state.schedules.push({
        ...action.payload,
        id: state.nextId,
      });
      state.nextId += 1;
    },
    updateSchedule: (state, action) => {
      const index = state.schedules.findIndex(
        (schedule) => schedule.id === action.payload.id,
      );
      if (index !== -1) {
        state.schedules[index] = action.payload;
      }
    },
    deleteSchedule: (state, action) => {
      state.schedules = state.schedules.filter(
        (schedule) => schedule.id !== action.payload,
      );
    },
  },
});

export const { addSchedule, updateSchedule, deleteSchedule } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
