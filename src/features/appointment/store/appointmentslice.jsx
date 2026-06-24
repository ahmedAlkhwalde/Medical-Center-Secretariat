import { createSlice } from "@reduxjs/toolkit";

// توقيت الجدول العام - تم إلغاء التقييد ليظهر كل الأطباء في سطر واحد فوراً
export const TIME_SLOTS = [
  { value: "ALL_DAY_SHIFTS", label: "الأطباء الحاليين" },
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export const YEARS = [2024, 2025, 2026, 2027,2028,2029,2030,2031,2032,2033,2034,2035];

export const DAY_LABELS = {
  SAT: "السبت", SUN: "الأحد", MON: "الإثنين", TUE: "الثلاثاء",
  WED: "الأربعاء", THU: "الخميس", FRI: "الجمعة",
};

const SPECIALTY_LABELS = {
  "غير معروف": "غير معروف",
};

const GENDER_LABELS = {
  Male: "ذكر",
  Female: "أنثى",
};

export const getSpecialtyLabel = (value) => SPECIALTY_LABELS[value] || value;
export const getGenderLabel = (value) => GENDER_LABELS[value] || value;

export const parseStartTime = (value) => {
  if (!value) return null;
  const match = value.match(/\d{1,2}:\d{2}/);
  return match ? match[0] : null;
};

export const formatRoom = (value) => (value ? `غرفة ${value}` : "");

// دالة مساعدة لحساب دليل الأسبوع الحالي (0, 1, 2, 3...) بناءً على تاريخ اليوم تلقائياً
const getCurrentWeekIndex = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay(); 
  return Math.floor((date.getDate() + dayOfWeek - 1) / 7);
};

// جلب تاريخ اليوم الحالي تلقائياً عند تحميل التطبيق
const today = new Date();

// دالة محاذاة البيانات (Mapper) لتحويل صيغة الـ API إلى صيغة الواجهات لدينا
export const mapApiScheduleToFrontend = (apiData) => {
  const dayMapping = {
    Saturday: "SAT", Sunday: "SUN", Monday: "MON", Tuesday: "TUE",
    Wednesday: "WED", Thursday: "THU", Friday: "FRI"
  };

  return (apiData || []).map((item) => {
    const doctorObj = item.doctlor || item.doctor || {}; // التعامل الآمن مع الـ Typo لقاعدة البيانات
    const startHour = item.start_time ? item.start_time.substring(0, 5) : "00:00";
    const endHour = item.end_time ? item.end_time.substring(0, 5) : "00:00";
    console.log("doctor obj: ",doctorObj);
    console.log("doctor slot slice : ",doctorObj.slot);
    return {
      id: doctorObj.uuid || item.uuid,
      scheduleUuid: item.uuid,
      name: doctorObj.name || "طبيب مجهول",
      specialty: item.specialty.name || "غير معروف",
      day: dayMapping[item.day_name_en] || "SUN",
      time: "ALL_DAY_SHIFTS", // توحيد القيمة مع الـ TIME_SLOTS ليظهر الطبيب بالجدول فوراً
      workingHours: `from : ${startHour} to : ${endHour}`, 
      slot: doctorObj.slot || "00:20:00",
      room: item.clinic?.name ? item.clinic.name.replace("عيادة ", "") : "101",
      isActive: item.is_active
    };
  });
};

const initialState = {
  doctorsSchedule: [],
  patients: [],
  appointments: [],
  selectedSpecialty: "all", 
  selectedDoctorId: "All Doctors",
  searchQuery: "",
  // إعدادات الوقت الافتراضية تعتمد ديناميكياً على تاريخ جهاز المستخدم اللحظي
  selectedYear: today.getFullYear(),
  selectedMonth: MONTHS[today.getMonth()],
  selectedWeek: getCurrentWeekIndex(today),
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setDoctorsSchedule: (state, action) => {
      state.doctorsSchedule = action.payload;
    },
    // دالة إعادة تعيين التاريخ والعودة إلى تاريخ اليوم الحالي فوراً
    resetToToday: (state) => {
      const currentToday = new Date();
      state.selectedYear = currentToday.getFullYear();
      state.selectedMonth = MONTHS[currentToday.getMonth()];
      state.selectedWeek = getCurrentWeekIndex(currentToday);
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    deleteAppointment: (state, action) => {
      const { doctorId, timeSlot } = action.payload;
      state.appointments = state.appointments.filter(
        (a) => !(a.doctorId === doctorId && a.timeSlot === timeSlot)
      );
    },
    updatePaymentStatus: (state, action) => {
      const { doctorId, timeSlot } = action.payload;
      const app = state.appointments.find(
        (a) => a.doctorId === doctorId && a.timeSlot === timeSlot
      );
      if (app) app.isPaid = !app.isPaid;
    },
    setSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setDoctorFilter: (state, action) => {
      state.selectedDoctorId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setSelectedWeek: (state, action) => {
      state.selectedWeek = action.payload;
    },
  },
});

export const {
  setDoctorsSchedule,
  resetToToday,
  addPatient,
  addAppointment,
  deleteAppointment,
  updatePaymentStatus,
  setSpecialty,
  setDoctorFilter,
  setSearchQuery,
  setSelectedYear,
  setSelectedMonth,
  setSelectedWeek,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;