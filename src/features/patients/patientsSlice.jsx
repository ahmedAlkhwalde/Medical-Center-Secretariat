import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patients: [
    {
      id: 12,
      name: "محمد",
      phone: "0987654432",
      visits: [
        {
          diagnosis: "مرض حاد",
          prescription: "دوا",
          visit_date: "2026-05-07 22:17:02",
          booking_source: "patient",
          visit_type: "check",
          doctor: {
            name: "د. محمود",
            specialization: "جلدية",
            clinic: "العيادة العينية",
          },
        },
        {
          diagnosis: "اقياء",
          prescription: "بندول",
          visit_date: "2026-05-07 22:26:33",
          booking_source: "Secretary",
          visit_type: "review",
          doctor: {
            name: "د. غلي",
            specialization: "عينية",
            clinic: "العيادة العينية",
          },
        },
      ],
    },
    {
      id: 13,
      name: "فاطمة أحمد",
      phone: "0912345678",
      visits: [
        {
          diagnosis: "صداع",
          prescription: "أسبرين",
          visit_date: "2026-05-06 15:30:00",
          booking_source: "patient",
          visit_type: "check",
          doctor: {
            name: "د. سارة",
            specialization: "طب عام",
            clinic: "العيادة الرئيسية",
          },
        },
      ],
    },
  ],
  searchResults: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
};

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    searchPatients: (state, action) => {
      const query = action.payload.toLowerCase().trim();
      if (!query) {
        state.searchResults = [];
        return;
      }

      state.searchResults = state.patients.filter((patient) => {
        const nameMatch = patient.name?.toLowerCase().includes(query);
        const phoneMatch = String(patient.phone || "").includes(query);

        const visitsMatch = (patient.visits || []).some((visit) => {
          const doctor = visit.doctor || {};
          const visitTypeLabel =
            visit.visit_type === "check" ? "فحص جديد" : "متابعة";
          const bookingSource = String(visit.booking_source || "");
          const bookingLabel =
            bookingSource.toLowerCase() === "patient"
              ? "حجز من المريض"
              : "حجز من الموظفة";

          const visitFields = [
            doctor.name,
            doctor.specialization,
            doctor.clinic,
            visit.visit_type,
            visitTypeLabel,
            bookingSource,
            bookingLabel,
            visit.visit_date,
          ]
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());

          return visitFields.some((field) => field.includes(query));
        });

        return nameMatch || phoneMatch || visitsMatch;
      });
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    selectPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
  },
});

export const {
  searchPatients,
  clearSearchResults,
  selectPatient,
  clearSelectedPatient,
} = patientsSlice.actions;

export default patientsSlice.reducer;
