// import { createSlice } from "@reduxjs/toolkit";

// // توقيت الجدول العام - تم إلغاء التقييد ليظهر كل الأطباء في سطر واحد فوراً
// export const TIME_SLOTS = [
//   { value: "ALL_DAY_SHIFTS", label: "الأطباء الحاليين" },
// ];

// export const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// export const MONTHS_AR = [
//   "يناير",
//   "فبراير",
//   "مارس",
//   "أبريل",
//   "مايو",
//   "يونيو",
//   "يوليو",
//   "أغسطس",
//   "سبتمبر",
//   "أكتوبر",
//   "نوفمبر",
//   "ديسمبر",
// ];

// export const YEARS = [
//   2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
// ];

// export const DAY_LABELS = {
//   SAT: "السبت",
//   SUN: "الأحد",
//   MON: "الإثنين",
//   TUE: "الثلاثاء",
//   WED: "الأربعاء",
//   THU: "الخميس",
//   FRI: "الجمعة",
// };

// const SPECIALTY_LABELS = {
//   "غير معروف": "غير معروف",
// };

// const GENDER_LABELS = {
//   Male: "ذكر",
//   Female: "أنثى",
// };

// export const getSpecialtyLabel = (value) => SPECIALTY_LABELS[value] || value;
// export const getGenderLabel = (value) => GENDER_LABELS[value] || value;

// export const parseStartTime = (value) => {
//   if (!value) return null;
//   const match = value.match(/\d{1,2}:\d{2}/);
//   return match ? match[0] : null;
// };

// export const formatRoom = (value) => (value ? `غرفة ${value}` : "");

// const formatTimeTo24Hour = (value) => {
//   if (!value) return "";

//   const text = value.toString().trim();
//   const amPmMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])$/);
//   if (amPmMatch) {
//     let hours = Number(amPmMatch[1]);
//     const minutes = amPmMatch[2];
//     const period = amPmMatch[3].toUpperCase();

//     if (period === "AM") {
//       hours = hours === 12 ? 0 : hours;
//     } else if (hours !== 12) {
//       hours += 12;
//     }

//     return `${String(hours).padStart(2, "0")}:${minutes}`;
//   }

//   const twentyFourHourMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
//   if (twentyFourHourMatch) {
//     return `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${twentyFourHourMatch[2]}`;
//   }

//   return text;
// };

// const parseISODate = (value) => {
//   if (!value) return null;
//   const date = new Date(`${value}T00:00:00`);
//   return Number.isNaN(date.getTime()) ? null : date;
// };

// const isDateInRange = (targetDate, startDate, endDate) => {
//   const target = parseISODate(targetDate);
//   if (!target) return false;

//   const start = parseISODate(startDate);
//   const end = parseISODate(endDate);

//   if (start && target < start) return false;
//   if (end && target > end) return false;

//   return true;
// };

// const normalizeDoctor = (source = {}, fallback = {}) => ({
//   id: source.doctor_uuid || source.uuid || source.id || fallback.id || "",
//   name: source.doctor_name || source.name || fallback.name || "طبيب مجهول",
//   specialization:
//     source.specialization?.name ||
//     source.specialization ||
//     fallback.specialization ||
//     "غير معروف",
//   clinic: source.clinic?.name || source.clinic || fallback.clinic || "",
// });

// const resolveDayShort = (value) => {
//   if (!value) return "SUN";

//   const normalized = value.toString().trim().toLowerCase();
//   const arabicMapping = {
//     السبت: "SAT",
//     الاحد: "SUN",
//     الأحد: "SUN",
//     الاثنين: "MON",
//     الإثنين: "MON",
//     الثلاثاء: "TUE",
//     الاربعاء: "WED",
//     الأربعاء: "WED",
//     الخميس: "THU",
//     الجمعة: "FRI",
//   };

//   const englishMapping = {
//     saturday: "SAT",
//     sunday: "SUN",
//     monday: "MON",
//     tuesday: "TUE",
//     wednesday: "WED",
//     thursday: "THU",
//     friday: "FRI",
//   };

//   return arabicMapping[value] || englishMapping[normalized] || "SUN";
// };

// const resolveScheduleRangeLabel = (schedule) => {
//   if (!schedule?.start_date && !schedule?.end_date) return "";
//   if (schedule.start_date && schedule.end_date) {
//     return `من ${schedule.start_date} إلى ${schedule.end_date}`;
//   }
//   return schedule.start_date || schedule.end_date || "";
// };

// // دالة مساعدة لحساب دليل الأسبوع الحالي (0, 1, 2, 3...) بناءً على تاريخ اليوم تلقائياً
// const getCurrentWeekIndex = (date) => {
//   const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//   const dayOfWeek = firstDayOfMonth.getDay();
//   return Math.floor((date.getDate() + dayOfWeek - 1) / 7);
// };

// // جلب تاريخ اليوم الحالي تلقائياً عند تحميل التطبيق
// const today = new Date();

// // دالة محاذاة البيانات (Mapper) لتحويل صيغة الـ API إلى صيغة الواجهات لدينا
// export const mapApiScheduleToFrontend = (apiData) => {
//   return (apiData || []).map((item) => {
//     const mergedOriginal = item.original_schedule || null;
//     const mergedModified = item.modified_schedule || null;
//     const sourceSchedule = mergedOriginal || item;
//     const doctorObj = normalizeDoctor(
//       sourceSchedule,
//       item.doctor || item.doctlor || {},
//     );
//     const startHour = formatTimeTo24Hour(sourceSchedule.start_time) || "00:00";
//     const endHour = formatTimeTo24Hour(sourceSchedule.end_time) || "00:00";
//     const dayShort = resolveDayShort(
//       sourceSchedule.day_name_en ||
//         sourceSchedule.day ||
//         item.day_name_en ||
//         item.day,
//     );
//     const modifiedDoctor = mergedModified
//       ? normalizeDoctor(mergedModified, doctorObj)
//       : null;
//     const modifiedStartHour = formatTimeTo24Hour(mergedModified?.start_time);
//     const modifiedEndHour = formatTimeTo24Hour(mergedModified?.end_time);
//     return {
//       id: doctorObj.id || item.uuid,
//       scheduleUuid: item.uuid,
//       name: doctorObj.name,
//       specialty:
//         doctorObj.specialization ||
//         item.specialty?.name ||
//         item.specialization ||
//         "غير معروف",
//       day: dayShort,
//       time: "ALL_DAY_SHIFTS",
//       workingHours: `from : ${startHour} to : ${endHour}`,
//       startHour,
//       endHour,
//       slot: doctorObj.slot || "00:20:00",
//       room: doctorObj.clinic
//         ? doctorObj.clinic.replace("عيادة ", "")
//         : item.clinic?.name
//           ? item.clinic.name.replace("عيادة ", "")
//           : "101",
//       isActive: item.is_active ?? true,
//       isModified: Boolean(item.is_modified),
//       originalSchedule: mergedOriginal
//         ? {
//             ...normalizeDoctor(mergedOriginal, doctorObj),
//             day: resolveDayShort(
//               mergedOriginal.day_name_en ||
//                 mergedOriginal.day ||
//                 item.day_name_en ||
//                 item.day,
//             ),
//             startHour,
//             endHour,
//             workingHours: `from : ${startHour} to : ${endHour}`,
//             room: doctorObj.clinic
//               ? doctorObj.clinic.replace("عيادة ", "")
//               : "101",
//           }
//         : null,
//       modifiedSchedule: mergedModified
//         ? {
//             ...modifiedDoctor,
//             day: resolveDayShort(
//               mergedModified.day_name_en ||
//                 mergedModified.day ||
//                 item.day_name_en ||
//                 item.day,
//             ),
//             startHour: modifiedStartHour,
//             endHour: modifiedEndHour,
//             workingHours: `from : ${modifiedStartHour} to : ${modifiedEndHour}`,
//             room: modifiedDoctor?.clinic
//               ? modifiedDoctor.clinic.replace("عيادة ", "")
//               : "101",
//             startDate: mergedModified.start_date,
//             endDate: mergedModified.end_date,
//             isPermanent: mergedModified.is_permanent,
//           }
//         : null,
//       modifiedStartDate: mergedModified?.start_date || null,
//       modifiedEndDate: mergedModified?.end_date || null,
//       modifiedDateRangeLabel: resolveScheduleRangeLabel(mergedModified),
//       displayVariantForDate: (dateISO) => {
//         if (!mergedModified?.start_date && !mergedModified?.end_date)
//           return "original";
//         return isDateInRange(
//           dateISO,
//           mergedModified.start_date,
//           mergedModified.end_date,
//         )
//           ? "modified"
//           : "original";
//       },
//     };
//   });
// };

// const initialState = {
//   doctorsSchedule: [],
//   patients: [],
//   appointments: [],
//   selectedSpecialty: "all",
//   selectedDoctorId: "All Doctors",
//   searchQuery: "",
//   // إعدادات الوقت الافتراضية تعتمد ديناميكياً على تاريخ جهاز المستخدم اللحظي
//   selectedYear: today.getFullYear(),
//   selectedMonth: MONTHS[today.getMonth()],
//   selectedWeek: getCurrentWeekIndex(today),
// };

// const appointmentSlice = createSlice({
//   name: "appointment",
//   initialState,
//   reducers: {
//     setDoctorsSchedule: (state, action) => {
//       state.doctorsSchedule = action.payload;
//     },
//     // دالة إعادة تعيين التاريخ والعودة إلى تاريخ اليوم الحالي فوراً
//     resetToToday: (state) => {
//       const currentToday = new Date();
//       state.selectedYear = currentToday.getFullYear();
//       state.selectedMonth = MONTHS[currentToday.getMonth()];
//       state.selectedWeek = getCurrentWeekIndex(currentToday);
//     },
//     addPatient: (state, action) => {
//       state.patients.push(action.payload);
//     },
//     addAppointment: (state, action) => {
//       state.appointments.push(action.payload);
//     },
//     deleteAppointment: (state, action) => {
//       const { doctorId, timeSlot } = action.payload;
//       state.appointments = state.appointments.filter(
//         (a) => !(a.doctorId === doctorId && a.timeSlot === timeSlot),
//       );
//     },
//     updatePaymentStatus: (state, action) => {
//       const { doctorId, timeSlot } = action.payload;
//       const app = state.appointments.find(
//         (a) => a.doctorId === doctorId && a.timeSlot === timeSlot,
//       );
//       if (app) app.isPaid = !app.isPaid;
//     },
//     setSpecialty: (state, action) => {
//       state.selectedSpecialty = action.payload;
//     },
//     setDoctorFilter: (state, action) => {
//       state.selectedDoctorId = action.payload;
//     },
//     setSearchQuery: (state, action) => {
//       state.searchQuery = action.payload;
//     },
//     setSelectedYear: (state, action) => {
//       state.selectedYear = action.payload;
//     },
//     setSelectedMonth: (state, action) => {
//       state.selectedMonth = action.payload;
//     },
//     setSelectedWeek: (state, action) => {
//       state.selectedWeek = action.payload;
//     },
//   },
// });

// export const {
//   setDoctorsSchedule,
//   resetToToday,
//   addPatient,
//   addAppointment,
//   deleteAppointment,
//   updatePaymentStatus,
//   setSpecialty,
//   setDoctorFilter,
//   setSearchQuery,
//   setSelectedYear,
//   setSelectedMonth,
//   setSelectedWeek,
// } = appointmentSlice.actions;

// export default appointmentSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

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

export const YEARS = [
  2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
];

export const DAY_LABELS = {
  SAT: "السبت",
  SUN: "الأحد",
  MON: "الإثنين",
  TUE: "الثلاثاء",
  WED: "الأربعاء",
  THU: "الخميس",
  FRI: "الجمعة",
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

const formatTimeTo24Hour = (value) => {
  if (!value) return "";

  const text = value.toString().trim();
  const amPmMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])$/);
  if (amPmMatch) {
    let hours = Number(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();
    if (period === "AM") {
      hours = hours === 12 ? 0 : hours;
    } else if (hours !== 12) {
      hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  const twentyFourHourMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHourMatch) {
    return `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${twentyFourHourMatch[2]}`;
  }

  return text;
};

const resolveDayShort = (value) => {
  if (!value) return "SUN";
  const normalized = value.toString().trim().toLowerCase();

  const arabicMapping = {
    السبت: "SAT", الاحد: "SUN", الأحد: "SUN",
    الاثنين: "MON", الإثنين: "MON", الثلاثاء: "TUE",
    الاربعاء: "WED", الأربعاء: "WED",
    الخميس: "THU", الجمعة: "FRI",
  };

  const englishMapping = {
    saturday: "SAT", sunday: "SUN", monday: "MON",
    tuesday: "TUE", wednesday: "WED", thursday: "THU", friday: "FRI",
  };

  return arabicMapping[value] || englishMapping[normalized] || "SUN";
};

// ✅ تحديث normalizeDoctor ليشمل visittime من المصدر أو البديل
const normalizeDoctor = (source = {}, fallback = {}) => ({
  id: source.doctor_uuid || source.uuid || source.id || fallback.id || "",
  name: source.doctor_name || source.name || fallback.name || "طبيب مجهول",
  specialization:
    source.specialization?.name ||
    source.specialization ||
    fallback.specialization ||
    "غير معروف",
  slot: source.visittime || source.slot || fallback.visittime || fallback.slot,
  clinic: source.clinic?.name || source.clinic || fallback.clinic || "",
});

export const mapApiScheduleToFrontend = (apiData) => {
  return (apiData || []).map((item) => {
    const mergedOriginal = item.original_schedule || null;
    const mergedModified = item.modified_schedule || null;
    const sourceSchedule = mergedOriginal || item;

    // ✅ تمرير visittime من item لضمان حصول normalizeDoctor عليها
    const doctorObj = normalizeDoctor(
      sourceSchedule,
      {
        ...(item.doctor || item.doctlor || {}),
        visittime: item.visittime,
      },
    );

    const startHour = formatTimeTo24Hour(sourceSchedule.start_time) || "00:00";
    const endHour = formatTimeTo24Hour(sourceSchedule.end_time) || "00:00";
    const dayShort = resolveDayShort(
      sourceSchedule.day_name_en || sourceSchedule.day || item.day_name_en || item.day,
    );

    const modifiedDoctor = mergedModified
      ? normalizeDoctor(
          mergedModified,
          {
            ...(item.doctor || item.doctlor || {}),
            visittime: item.visittime,
          },
        )
      : null;

    const modifiedStartHour = formatTimeTo24Hour(mergedModified?.start_time);
    const modifiedEndHour = formatTimeTo24Hour(mergedModified?.end_time);
    const modifiedDayShort = mergedModified
      ? resolveDayShort(
          mergedModified.day_name_en || mergedModified.day || item.day_name_en || item.day,
        )
      : dayShort;

    return {
      id: item.uuid || doctorObj.id,
      scheduleUuid: item.uuid,
      doctorUuid: doctorObj.id,
      name: doctorObj.name,
      specialty: doctorObj.specialization,
      day: dayShort,
      time: "ALL_DAY_SHIFTS",
      workingHours: `from : ${startHour} to : ${endHour}`,
      startHour,
      endHour,
      slot: doctorObj.slot || "00:20:00",
      room: doctorObj.clinic
        ? doctorObj.clinic.replace("عيادة ", "")
        : item.clinic?.name
          ? item.clinic.name.replace("عيادة ", "")
          : "101",
      isActive: item.is_active ?? true,
      isModified: Boolean(item.is_modified),
      originalSchedule: {
        ...doctorObj,
        day: dayShort,
        startHour,
        endHour,
        workingHours: `from : ${startHour} to : ${endHour}`,
        room: doctorObj.clinic ? doctorObj.clinic.replace("عيادة ", "") : "101",
      },
      modifiedSchedule: mergedModified
        ? {
            ...modifiedDoctor,
            day: modifiedDayShort,
            startHour: modifiedStartHour,
            endHour: modifiedEndHour,
            workingHours: `from : ${modifiedStartHour} to : ${modifiedEndHour}`,
            room: modifiedDoctor?.clinic
              ? modifiedDoctor.clinic.replace("عيادة ", "")
              : "101",
            startDate: mergedModified.start_date,
            endDate: mergedModified.end_date,
            isPermanent: mergedModified.is_permanent,
          }
        : null,
      modifiedStartDate: mergedModified?.start_date || null,
      modifiedEndDate: mergedModified?.end_date || null,
      displayVariantForDate: (dateISO) => {
        if (!mergedModified) return "original";
        return isDateInRange(dateISO, mergedModified.start_date, mergedModified.end_date)
          ? "modified"
          : "original";
      },
    };
  });
};

// دالة فحص التاريخ
const parseISO = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return isNaN(date.getTime()) ? null : date;
};

const isDateInRange = (dateISO, startDate, endDate) => {
  const target = parseISO(dateISO);
  if (!target) return false;
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (start && target < start) return false;
  if (end && target > end) return false;
  return true;
};

const getCurrentWeekIndex = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  return Math.floor((date.getDate() + dayOfWeek - 1) / 7);
};

const today = new Date();

const initialState = {
  doctorsSchedule: [],
  patients: [],
  appointments: [],
  selectedSpecialty: "all",
  selectedDoctorId: "All Doctors",
  searchQuery: "",
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
        (a) => !(a.doctorId === doctorId && a.timeSlot === timeSlot),
      );
    },
    updatePaymentStatus: (state, action) => {
      const { doctorId, timeSlot } = action.payload;
      const app = state.appointments.find(
        (a) => a.doctorId === doctorId && a.timeSlot === timeSlot,
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