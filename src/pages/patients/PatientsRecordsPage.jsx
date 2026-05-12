import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, SearchOff } from "@mui/icons-material";
import {
  clearSearchResults,
  clearSelectedPatient,
  searchPatients,
  selectPatient,
} from "../../features/patients/patientsSlice";
import PatientCard from "./components/PatientCard";
import PatientRecordDetail from "./components/PatientRecordDetail";

const PatientsRecordsPage = () => {
  const dispatch = useDispatch();
  const { patients, searchResults, selectedPatient } = useSelector(
    (state) => state.patients,
  );
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const parseVisitDate = (value) => {
    if (!value) {
      return null;
    }

    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatVisitDate = (date, fallback) => {
    if (!date) {
      return fallback || "-";
    }

    return date.toLocaleDateString("ar-SA", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatVisitType = (value) =>
    value === "check" ? "فحص جديد" : "متابعة";

  const formatBookingSource = (value) =>
    String(value || "").toLowerCase() === "patient"
      ? "حجز من المريض"
      : "حجز من الموظفة";

  useEffect(() => {
    dispatch(clearSelectedPatient());
    dispatch(clearSearchResults());

    return () => {
      dispatch(clearSelectedPatient());
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);

    if (query.trim()) {
      dispatch(searchPatients(query));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleResetSearch = () => {
    setLocalSearchQuery("");
    dispatch(clearSearchResults());
    dispatch(clearSelectedPatient());
  };

  // إذا تم تحديد مريض، أظهر تفاصيله
  if (selectedPatient) {
    return <PatientRecordDetail patient={selectedPatient} />;
  }

  const normalizedQuery = localSearchQuery.trim();
  const isSearching = Boolean(normalizedQuery);
  const now = new Date();

  const upcomingAppointments = patients
    .flatMap((patient) =>
      (patient.visits || []).map((visit) => ({
        patient,
        visit,
        date: parseVisitDate(visit.visit_date),
      })),
    )
    .filter((item) => item.date && item.date > now)
    .sort((first, second) => first.date - second.date);

  const displayedPatients = isSearching ? searchResults : [];

  return (
    <div className="w-full min-h-screen">
      <div className="w-full">
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="sticky top-0 z-10 px-3 py-4 backdrop-blur-md theme-surface-90 border-b theme-border">
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="text-right">
                  <h2 className="text-lg font-bold theme-text">
                    أرشيف المواعيد
                  </h2>
                  <p className="text-xs theme-text-muted">
                    {isSearching
                      ? `نتائج البحث: ${displayedPatients.length} مريض`
                      : `المواعيد القادمة: ${upcomingAppointments.length}`}
                  </p>
                </div>

                {isSearching ? (
                  <button
                    onClick={handleResetSearch}
                    className="px-4 py-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors text-sm"
                  >
                    مسح البحث
                  </button>
                ) : null}
              </div>

              <div className="w-full rounded-3xl p-1 theme-gradient-border shadow-lg">
                <div className="relative rounded-3xl theme-surface-90">
                  <input
                    type="text"
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    placeholder="ابحث باسم المريض أو رقم الهاتف..."
                    className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-4 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                    autoFocus
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none"
                    fontSize="small"
                  />
                </div>
              </div>
            </div>
          </div>

          {isSearching ? (
            displayedPatients.length > 0 ? (
              <div className="space-y-2 mt-6">
                <AnimatePresence mode="popLayout">
                  {displayedPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <SearchOff
                  sx={{
                    fontSize: 80,
                    color: "var(--color-text-muted)",
                    opacity: 0.2,
                    marginBottom: 2,
                  }}
                />
                <p className="theme-text-muted">
                  لم يتم العثور على نتائج مطابقة للبحث
                </p>
                <p className="text-xs theme-text-muted mt-2">
                  جرّب البحث برقم الهاتف أو اسم الطبيب أو العيادة.
                </p>
              </Motion.div>
            )
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-3 mt-6">
              <AnimatePresence mode="popLayout">
                {upcomingAppointments.map(({ patient, visit, date }) => (
                  <Motion.button
                    key={`${patient.id}-${visit.visit_date}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    type="button"
                    onClick={() => dispatch(selectPatient(patient))}
                    className="w-full text-right group relative overflow-hidden rounded-3xl theme-surface-90 p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                  >
                    <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-emerald-500 via-cyan-500 to-transparent"></div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="text-right">
                        <p className="text-sm font-semibold theme-text">
                          {patient.name}
                        </p>
                        <p className="text-xs theme-text-muted">
                          📞 {patient.phone}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          موعد قادم
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {formatVisitType(visit.visit_type)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                      <div className="rounded-2xl theme-surface-80 border theme-border p-3">
                        <p className="theme-text-muted mb-1">الطبيب</p>
                        <p className="theme-text font-semibold">
                          {visit.doctor?.name} · {visit.doctor?.specialization}
                        </p>
                        <p className="theme-text-muted">
                          📍 {visit.doctor?.clinic}
                        </p>
                      </div>

                      <div className="rounded-2xl theme-surface-80 border theme-border p-3">
                        <p className="theme-text-muted mb-1">موعد الزيارة</p>
                        <p className="theme-text font-semibold">
                          {formatVisitDate(date, visit.visit_date)}
                        </p>
                        <p className="theme-text-muted">
                          {formatBookingSource(visit.booking_source)}
                        </p>
                      </div>
                    </div>
                  </Motion.button>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <SearchOff
                sx={{
                  fontSize: 80,
                  color: "var(--color-text-muted)",
                  opacity: 0.2,
                  marginBottom: 2,
                }}
              />
              <p className="theme-text-muted">لا توجد مواعيد قادمة حالياً</p>
              <p className="text-xs theme-text-muted mt-2">
                يمكنك استخدام البحث لعرض أرشيف المرضى بالكامل.
              </p>
            </Motion.div>
          )}
        </Motion.div>
      </div>
    </div>
  );
};

export default PatientsRecordsPage;
