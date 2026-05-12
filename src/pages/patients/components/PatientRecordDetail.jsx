import { motion as Motion, AnimatePresence } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { clearSelectedPatient } from "../../../features/patients/patientsSlice";

const formatDoctorName = (name = "") => {
  const trimmedName = name.trim();
  return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
};

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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PatientRecordDetail = ({ patient, onBack }) => {
  const dispatch = useDispatch();
  const now = new Date();
  const sortedVisits = (patient.visits || [])
    .map((visit) => ({
      visit,
      date: parseVisitDate(visit.visit_date),
    }))
    .sort(
      (first, second) =>
        (second.date?.getTime() || 0) - (first.date?.getTime() || 0),
    );

  const handleBack = () => {
    dispatch(clearSelectedPatient());
    onBack?.();
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      {/* رأس الصفحة */}
      <div className="sticky top-0 z-10 mb-6 -mx-3 px-3 py-4 backdrop-blur-md theme-surface-90 border-b theme-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors"
            aria-label="عودة للبحث"
          >
            <ArrowBack />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold theme-text">{patient.name}</h1>
            <p className="text-sm theme-text-muted">📞 {patient.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-sm theme-text-muted">إجمالي الزيارات</p>
            <p className="text-2xl font-bold theme-text">
              {patient.visits?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* قائمة الزيارات */}
      <div className="max-w-4xl mx-auto">
        {sortedVisits.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {sortedVisits.map(({ visit, date }, idx) => {
              const isUpcoming = Boolean(date && date > now);

              return (
                <Motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* خط ملون على الجانب الأيسر */}
                  <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-green-500 via-blue-500 to-transparent"></div>

                  {/* دائرة صغيرة */}
                  <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-green-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

                  <div className="pr-4">
                    {/* رأس الزيارة */}
                    <div className="mb-4 border-b theme-border pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold theme-text">
                          {formatDoctorName(visit.doctor?.name)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {visit.visit_type === "check"
                              ? "فحص جديد"
                              : "متابعة"}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              isUpcoming
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-500/10 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {isUpcoming ? "موعد قادم" : "مؤرشف"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm theme-text-muted mb-1">
                        {visit.doctor.specialization}
                      </p>
                      <p className="text-sm theme-text-muted">
                        📍 {visit.doctor.clinic}
                      </p>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
                        <p className="theme-text-muted mb-1">تاريخ الزيارة</p>
                        <p className="theme-text font-semibold">
                          {formatVisitDate(date, visit.visit_date)}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl theme-surface-80 border theme-border">
                        <p className="theme-text-muted mb-1">مصدر الحجز</p>
                        <p className="theme-text font-semibold capitalize">
                          {visit.booking_source === "patient"
                            ? "حجز من المريض"
                            : "حجز من الموظفة"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="theme-text-muted text-lg">لا توجد زيارات مسجلة</p>
          </Motion.div>
        )}
      </div>
    </Motion.div>
  );
};

export default PatientRecordDetail;
