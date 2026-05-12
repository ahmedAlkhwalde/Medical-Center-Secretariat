// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   selectedSpecialty: 'All Specialties',
//   selectedDoctorId: 'All Doctors',
//   searchQuery: '',
//    doctorsSchedule: [

//     // --- السبت SAT ---
//     { id: 1, name: 'Dr. Aris Thorne', specialty: 'Surgery', room: 'RM 402', day: 'SAT', time: '08:00', color: 'blue' },
//     { id: 2, name: 'Dr. Elena Vance', specialty: 'Pediatrics', room: 'RM 105', day: 'SAT', time: '08:00', color: 'purple' },
//     { id: 3, name: 'Dr. Marcus Aurelius', specialty: 'Internal Medicine', room: 'RM 202', day: 'SAT', time: '09:00', color: 'green' },
//     { id: 4, name: 'Dr. Hai Jordan', specialty: 'Surgery', room: 'RM 412', day: 'SAT', time: '10:00', color: 'blue' },
//     { id: 5, name: 'Dr. Stephen Strange', specialty: 'Surgery', room: 'RM 411', day: 'SAT', time: '13:00', color: 'blue' },

//     // --- الأحد SUN ---
//     { id: 6, name: 'Dr. Simon Lee', specialty: 'Internal Medicine', room: 'RM 201', day: 'SUN', time: '08:00', color: 'green' },
//     { id: 7, name: 'Dr. Lydia Deetz', specialty: 'Surgery', room: 'RM 405', day: 'SUN', time: '09:00', color: 'blue' },
//     { id: 8, name: 'Dr. Diana Prince', specialty: 'Pediatrics', room: 'RM 120', day: 'SUN', time: '10:00', color: 'purple' },
//     { id: 9, name: 'Dr. Tony Stark', specialty: 'Surgery', room: 'RM 220', day: 'SUN', time: '13:00', color: 'blue' },

//     // --- الاثنين MON ---
//     { id: 10, name: 'Dr. Sarah Miller', specialty: 'Surgery', room: 'RM 403', day: 'MON', time: '08:00', color: 'blue' },
//     { id: 11, name: 'Dr. James Holt', specialty: 'Internal Medicine', room: 'RM 210', day: 'MON', time: '09:00', color: 'green' },
//     { id: 12, name: 'Dr. Wendy Darling', specialty: 'Internal Medicine', room: 'RM 211', day: 'MON', time: '09:00', color: 'green' },
//     { id: 13, name: 'Dr. Barry Allen', specialty: 'Pediatrics', room: 'RM 122', day: 'MON', time: '10:00', color: 'purple' },

//     // --- الثلاثاء TUE ---
//     { id: 14, name: 'Dr. Amy Pond', specialty: 'Pediatrics', room: 'RM 102', day: 'TUE', time: '08:00', color: 'purple' },
//     { id: 15, name: 'Dr. Peter Pan', specialty: 'Surgery', room: 'RM 112', day: 'TUE', time: '09:00', color: 'blue' },
//     { id: 16, name: 'Dr. Victor Stone', specialty: 'Surgery', room: 'RM 440', day: 'TUE', time: '10:00', color: 'blue' },
//     { id: 17, name: 'Dr. Arthur Curry', specialty: 'Internal Medicine', room: 'RM 221', day: 'TUE', time: '10:00', color: 'green' },

//     // --- الأربعاء WED ---
//     { id: 18, name: 'Dr. John Watson', specialty: 'Internal Medicine', room: 'RM 205', day: 'WED', time: '08:00', color: 'green' },
//     { id: 19, name: 'Dr. Bruce Wayne', specialty: 'Surgery', room: 'RM 401', day: 'WED', time: '09:00', color: 'blue' },
//     { id: 20, name: 'Dr. Natasha Romanoff', specialty: 'Surgery', room: 'RM 126', day: 'WED', time: '13:00', color: 'blue' },

//     // --- الخميس THU ---
//     { id: 21, name: 'Dr. Clara Oswald', specialty: 'Surgery', room: 'RM 401', day: 'THU', time: '08:00', color: 'blue' },
//     { id: 22, name: 'Dr. Selina Kyle', specialty: 'Pediatrics', room: 'RM 115', day: 'THU', time: '09:00', color: 'purple' },
//     { id: 23, name: 'Dr. Jordan Kent', specialty: 'Surgery', room: 'RM 412', day: 'THU', time: '10:00', color: 'blue' },
//     { id: 24, name: 'Dr. Steve Rogers', specialty: 'Surgery', room: 'RM 410', day: 'THU', time: '13:00', color: 'blue' },

//     // --- الجمعة FRI ---
//     { id: 25, name: 'Dr. Martha Jones', specialty: 'Pediatrics', room: 'RM 109', day: 'FRI', time: '08:00', color: 'purple' },
//     { id: 26, name: 'Dr. Clark Kent', specialty: 'Internal Medicine', room: 'RM 215', day: 'FRI', time: '09:00', color: 'green' },
//     { id: 27, name: 'Dr. Bruce Banner', specialty: 'Surgery', room: 'RM 230', day: 'FRI', time: '13:00', color: 'blue' },
//   ],
//   patients: [
//     { id: 'p1', name: 'Ahmad Ali', phone: '0933111222', dob: '1990-01-01', gender: 'Male' },
//     { id: 'p2', name: 'Sara Smith', phone: '0944555666', dob: '1995-05-12', gender: 'Female' },
//   ],
//   appointments: []
// };

// const appointmentSlice = createSlice({
//   name: 'schedule',
//   initialState,
//   reducers: {
//     setSpecialty: (state, action) => { state.selectedSpecialty = action.payload; },
//     setDoctorFilter: (state, action) => { state.selectedDoctorId = action.payload; },
//     setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
//     addPatient: (state, action) => { state.patients.push(action.payload); },
//     addAppointment: (state, action) => {
//       // منع التكرار في نفس الوقت لنفس الطبيب
//       const exists = state.appointments.find(a => a.doctorId === action.payload.doctorId && a.timeSlot === action.payload.timeSlot);
//       if (!exists) state.appointments.push(action.payload);
//     },
//     deleteAppointment: (state, action) => {
//       state.appointments = state.appointments.filter(app =>
//         !(app.doctorId === action.payload.doctorId && app.timeSlot === action.payload.timeSlot)
//       );
//     },
//     // داخل reducers في ملف appointmentSlice
//     updatePaymentStatus: (state, action) => {
//     const { doctorId, timeSlot } = action.payload;
//     const appointment = state.appointments.find(
//         a => a.doctorId === doctorId && a.timeSlot === timeSlot
//     );
//     if (appointment) {
//         appointment.isPaid = !appointment.isPaid; // تبديل الحالة
//     }
//     }
//   },
// });

// export const { setSpecialty, setDoctorFilter, setSearchQuery, addPatient, addAppointment, deleteAppointment } = appointmentSlice.actions;
// export default appointmentSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSpecialty: "All Specialties",
  selectedDoctorId: "All Doctors",
  searchQuery: "",
  doctorsSchedule: [
    // --- السبت SAT ---
    {
      id: 1,
      name: "Dr. Aris Thorne",
      specialty: "Surgery",
      room: "RM 402",
      day: "SAT",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },
    {
      id: 2,
      name: "Dr. Elena Vance",
      specialty: "Pediatrics",
      room: "RM 105",
      day: "SAT",
      time: "from : 4:00 to : 10:00",
      color: "purple",
    },
    {
      id: 3,
      name: "Dr. Marcus Aurelius",
      specialty: "Internal Medicine",
      room: "RM 202",
      day: "SAT",
      time: "from : 8:00 to : 2:00",
      color: "green",
    },
    {
      id: 4,
      name: "Dr. Hai Jordan",
      specialty: "Surgery",
      room: "RM 412",
      day: "SAT",
      time: "from : 4:00 to : 10:00",
      color: "blue",
    },
    {
      id: 5,
      name: "Dr. Stephen Strange",
      specialty: "Surgery",
      room: "RM 411",
      day: "SAT",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },

    // --- الأحد SUN ---
    {
      id: 6,
      name: "Dr. Simon Lee",
      specialty: "Internal Medicine",
      room: "RM 201",
      day: "SUN",
      time: "from : 4:00 to : 10:00",
      color: "green",
    },
    {
      id: 7,
      name: "Dr. Lydia Deetz",
      specialty: "Surgery",
      room: "RM 405",
      day: "SUN",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },
    {
      id: 8,
      name: "Dr. Diana Prince",
      specialty: "Pediatrics",
      room: "RM 120",
      day: "SUN",
      time: "from : 4:00 to : 10:00",
      color: "purple",
    },
    {
      id: 9,
      name: "Dr. Tony Stark",
      specialty: "Surgery",
      room: "RM 220",
      day: "SUN",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },

    // --- الاثنين MON ---
    {
      id: 10,
      name: "Dr. Sarah Miller",
      specialty: "Surgery",
      room: "RM 403",
      day: "MON",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },
    {
      id: 11,
      name: "Dr. James Holt",
      specialty: "Internal Medicine",
      room: "RM 210",
      day: "MON",
      time: "from : 4:00 to : 10:00",
      color: "green",
    },
    {
      id: 12,
      name: "Dr. Wendy Darling",
      specialty: "Internal Medicine",
      room: "RM 211",
      day: "MON",
      time: "from : 8:00 to : 2:00",
      color: "green",
    },
    {
      id: 13,
      name: "Dr. Barry Allen",
      specialty: "Pediatrics",
      room: "RM 122",
      day: "MON",
      time: "from : 4:00 to : 10:00",
      color: "purple",
    },

    // --- الثلاثاء TUE ---
    {
      id: 14,
      name: "Dr. Amy Pond",
      specialty: "Pediatrics",
      room: "RM 102",
      day: "TUE",
      time: "from : 4:00 to : 10:00",
      color: "purple",
    },
    {
      id: 15,
      name: "Dr. Peter Pan",
      specialty: "Surgery",
      room: "RM 112",
      day: "TUE",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },
    {
      id: 16,
      name: "Dr. Victor Stone",
      specialty: "Surgery",
      room: "RM 440",
      day: "TUE",
      time: "from : 4:00 to : 10:00",
      color: "blue",
    },
    {
      id: 17,
      name: "Dr. Arthur Curry",
      specialty: "Internal Medicine",
      room: "RM 221",
      day: "TUE",
      time: "from : 8:00 to : 2:00",
      color: "green",
    },

    // --- الأربعاء WED ---
    {
      id: 18,
      name: "Dr. John Watson",
      specialty: "Internal Medicine",
      room: "RM 205",
      day: "WED",
      time: "from : 8:00 to : 2:00",
      color: "green",
    },
    {
      id: 19,
      name: "Dr. Bruce Wayne",
      specialty: "Surgery",
      room: "RM 401",
      day: "WED",
      time: "from : 4:00 to : 10:00",
      color: "blue",
    },
    {
      id: 20,
      name: "Dr. Natasha Romanoff",
      specialty: "Surgery",
      room: "RM 126",
      day: "WED",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },

    // --- الخميس THU ---
    {
      id: 21,
      name: "Dr. Clara Oswald",
      specialty: "Surgery",
      room: "RM 401",
      day: "THU",
      time: "from : 4:00 to : 10:00",
      color: "blue",
    },
    {
      id: 22,
      name: "Dr. Selina Kyle",
      specialty: "Pediatrics",
      room: "RM 115",
      day: "THU",
      time: "from : 8:00 to : 2:00",
      color: "purple",
    },
    {
      id: 23,
      name: "Dr. Jordan Kent",
      specialty: "Surgery",
      room: "RM 412",
      day: "THU",
      time: "from : 4:00 to : 10:00",
      color: "blue",
    },
    {
      id: 24,
      name: "Dr. Steve Rogers",
      specialty: "Surgery",
      room: "RM 410",
      day: "THU",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },

    // --- الجمعة FRI ---
    {
      id: 25,
      name: "Dr. Martha Jones",
      specialty: "Pediatrics",
      room: "RM 109",
      day: "FRI",
      time: "from : 8:00 to : 2:00",
      color: "purple",
    },
    {
      id: 26,
      name: "Dr. Clark Kent",
      specialty: "Internal Medicine",
      room: "RM 215",
      day: "FRI",
      time: "from : 4:00 to : 10:00",
      color: "green",
    },
    {
      id: 27,
      name: "Dr. Bruce Banner",
      specialty: "Surgery",
      room: "RM 230",
      day: "FRI",
      time: "from : 8:00 to : 2:00",
      color: "blue",
    },
  ],
  patients: [
    {
      id: "p1",
      name: "Ahmad Ali",
      phone: "0933111222",
      dob: "1990-01-01",
      gender: "Male",
    },
    {
      id: "p2",
      name: "Sara Smith",
      phone: "0944555666",
      dob: "1995-05-12",
      gender: "Female",
    },
  ],
  appointments: [],
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setDoctorFilter: (state, action) => {
      state.selectedDoctorId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.unshift(action.payload);
    },
    addAppointment: (state, action) => {
      const exists = state.appointments.find(
        (a) =>
          a.doctorId === action.payload.doctorId &&
          a.timeSlot === action.payload.timeSlot,
      );
      if (!exists) state.appointments.push(action.payload);
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (app) =>
          !(
            app.doctorId === action.payload.doctorId &&
            app.timeSlot === action.payload.timeSlot
          ),
      );
    },
    updatePaymentStatus: (state, action) => {
      const { doctorId, timeSlot } = action.payload;
      const appointment = state.appointments.find(
        (a) => a.doctorId === doctorId && a.timeSlot === timeSlot,
      );
      if (appointment) {
        appointment.isPaid = !appointment.isPaid;
      }
    },
  },
});

export const {
  setSpecialty,
  setDoctorFilter,
  setSearchQuery,
  addPatient,
  addAppointment,
  deleteAppointment,
  updatePaymentStatus,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   selectedSpecialty: 'All Specialties',
//   doctorsSchedule: [
//     // --- السبت SAT ---
//     { id: 1, name: 'Dr. Aris Thorne', specialty: 'Surgery', room: 'RM 402', day: 'SAT', time: '08:00', color: 'blue' },
//     { id: 2, name: 'Dr. Elena Vance', specialty: 'Pediatrics', room: 'RM 105', day: 'SAT', time: '08:00', color: 'purple' },
//     { id: 3, name: 'Dr. Marcus Aurelius', specialty: 'Internal Medicine', room: 'RM 202', day: 'SAT', time: '09:00', color: 'green' },
//     { id: 4, name: 'Dr. Hai Jordan', specialty: 'Surgery', room: 'RM 412', day: 'SAT', time: '10:00', color: 'blue' },
//     { id: 5, name: 'Dr. Stephen Strange', specialty: 'Surgery', room: 'RM 411', day: 'SAT', time: '13:00', color: 'blue' },

//     // --- الأحد SUN ---
//     { id: 6, name: 'Dr. Simon Lee', specialty: 'Internal Medicine', room: 'RM 201', day: 'SUN', time: '08:00', color: 'green' },
//     { id: 7, name: 'Dr. Lydia Deetz', specialty: 'Surgery', room: 'RM 405', day: 'SUN', time: '09:00', color: 'blue' },
//     { id: 8, name: 'Dr. Diana Prince', specialty: 'Pediatrics', room: 'RM 120', day: 'SUN', time: '10:00', color: 'purple' },
//     { id: 9, name: 'Dr. Tony Stark', specialty: 'Surgery', room: 'RM 220', day: 'SUN', time: '13:00', color: 'blue' },

//     // --- الاثنين MON ---
//     { id: 10, name: 'Dr. Sarah Miller', specialty: 'Surgery', room: 'RM 403', day: 'MON', time: '08:00', color: 'blue' },
//     { id: 11, name: 'Dr. James Holt', specialty: 'Internal Medicine', room: 'RM 210', day: 'MON', time: '09:00', color: 'green' },
//     { id: 12, name: 'Dr. Wendy Darling', specialty: 'Internal Medicine', room: 'RM 211', day: 'MON', time: '09:00', color: 'green' },
//     { id: 13, name: 'Dr. Barry Allen', specialty: 'Pediatrics', room: 'RM 122', day: 'MON', time: '10:00', color: 'purple' },

//     // --- الثلاثاء TUE ---
//     { id: 14, name: 'Dr. Amy Pond', specialty: 'Pediatrics', room: 'RM 102', day: 'TUE', time: '08:00', color: 'purple' },
//     { id: 15, name: 'Dr. Peter Pan', specialty: 'Surgery', room: 'RM 112', day: 'TUE', time: '09:00', color: 'blue' },
//     { id: 16, name: 'Dr. Victor Stone', specialty: 'Surgery', room: 'RM 440', day: 'TUE', time: '10:00', color: 'blue' },
//     { id: 17, name: 'Dr. Arthur Curry', specialty: 'Internal Medicine', room: 'RM 221', day: 'TUE', time: '10:00', color: 'green' },

//     // --- الأربعاء WED ---
//     { id: 18, name: 'Dr. John Watson', specialty: 'Internal Medicine', room: 'RM 205', day: 'WED', time: '08:00', color: 'green' },
//     { id: 19, name: 'Dr. Bruce Wayne', specialty: 'Surgery', room: 'RM 401', day: 'WED', time: '09:00', color: 'blue' },
//     { id: 20, name: 'Dr. Natasha Romanoff', specialty: 'Surgery', room: 'RM 126', day: 'WED', time: '13:00', color: 'blue' },

//     // --- الخميس THU ---
//     { id: 21, name: 'Dr. Clara Oswald', specialty: 'Surgery', room: 'RM 401', day: 'THU', time: '08:00', color: 'blue' },
//     { id: 22, name: 'Dr. Selina Kyle', specialty: 'Pediatrics', room: 'RM 115', day: 'THU', time: '09:00', color: 'purple' },
//     { id: 23, name: 'Dr. Jordan Kent', specialty: 'Surgery', room: 'RM 412', day: 'THU', time: '10:00', color: 'blue' },
//     { id: 24, name: 'Dr. Steve Rogers', specialty: 'Surgery', room: 'RM 410', day: 'THU', time: '13:00', color: 'blue' },

//     // --- الجمعة FRI ---
//     { id: 25, name: 'Dr. Martha Jones', specialty: 'Pediatrics', room: 'RM 109', day: 'FRI', time: '08:00', color: 'purple' },
//     { id: 26, name: 'Dr. Clark Kent', specialty: 'Internal Medicine', room: 'RM 215', day: 'FRI', time: '09:00', color: 'green' },
//     { id: 27, name: 'Dr. Bruce Banner', specialty: 'Surgery', room: 'RM 230', day: 'FRI', time: '13:00', color: 'blue' },
//   ],
// };

// const appointmentSlice = createSlice({
//   name: 'schedule',
//   initialState,
//   reducers: {
//     setSpecialty: (state, action) => {
//       state.selectedSpecialty = action.payload;
//     },
//   },
// });

// export const { setSpecialty } = appointmentSlice.actions;
// export default appointmentSlice.reducer;
