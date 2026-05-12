import { motion as Motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { selectPatient } from "../../../features/patients/patientsSlice";

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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PatientCard = ({ patient, onClick }) => {
  const dispatch = useDispatch();

  const now = new Date();
  const visitsWithDates = (patient.visits || []).map((visit) => ({
    visit,
    date: parseVisitDate(visit.visit_date),
  }));
  const upcomingVisits = visitsWithDates.filter(
    (item) => item.date && item.date > now,
  );
  const archivedVisits = visitsWithDates.filter(
    (item) => !item.date || item.date <= now,
  );

  const nextVisit = upcomingVisits.reduce((closest, current) => {
    if (!closest || current.date < closest.date) {
      return current;
    }
    return closest;
  }, null);

  const lastArchivedVisit = archivedVisits.reduce((latest, current) => {
    if (!current.date) {
      return latest;
    }
    if (!latest || current.date > latest.date) {
      return current;
    }
    return latest;
  }, null);

  const handleCardClick = () => {
    dispatch(selectPatient(patient));
    onClick?.();
  };

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative mb-4 overflow-hidden rounded-3xl theme-surface-90 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* خط أفقي على الجانب الأيسر */}
      <div className="absolute right-0 top-0 w-1 h-full bg-linear-to-b from-blue-500 via-purple-500 to-transparent"></div>

      {/* دائرة صغيرة زينة على الجانب الأيمن */}
      <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>

      <div className="pr-4">
        {/* معلومات المريض الأساسية */}
        <div className="mb-4 border-b theme-border pb-3">
          <h3 className="text-lg font-bold theme-text mb-1">{patient.name}</h3>
          <p className="text-sm theme-text-muted flex items-center gap-2">
            <span>📞</span>
            <span>{patient.phone}</span>
          </p>
        </div>

        {/* معلومات الزيارات */}
        <div className="space-y-3">
          <p className="text-sm font-semibold theme-text-muted">
            المواعيد القادمة: {upcomingVisits.length} · المواعيد المؤرشفة:{" "}
            {archivedVisits.length}
          </p>

          {(nextVisit || lastArchivedVisit) && (
            <div className="space-y-2">
              {nextVisit && (
                <div className="text-xs theme-text-muted p-2 rounded-lg theme-surface-80 border theme-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      موعد قادم
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {formatVisitDate(
                        nextVisit.date,
                        nextVisit.visit.visit_date,
                      )}
                    </span>
                  </div>
                  <p className="text-[11px]">
                    {formatDoctorName(nextVisit.visit.doctor?.name)} ·{" "}
                    {nextVisit.visit.doctor?.specialization}
                  </p>
                </div>
              )}

              {lastArchivedVisit && (
                <div className="text-xs theme-text-muted p-2 rounded-lg theme-surface-80 border theme-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      آخر موعد مؤرشف
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {formatVisitDate(
                        lastArchivedVisit.date,
                        lastArchivedVisit.visit.visit_date,
                      )}
                    </span>
                  </div>
                  <p className="text-[11px]">
                    {formatDoctorName(lastArchivedVisit.visit.doctor?.name)} ·{" "}
                    {lastArchivedVisit.visit.doctor?.specialization}
                  </p>
                </div>
              )}
            </div>
          )}

          {!nextVisit && !lastArchivedVisit && (
            <p className="text-xs theme-text-muted">
              لا توجد مواعيد مسجلة لهذا المريض.
            </p>
          )}

          <p className="text-xs text-blue-500 cursor-pointer hover:underline">
            اضغط لعرض أرشيف المواعيد بالكامل
          </p>
        </div>
      </div>
    </Motion.div>
  );
};

export default PatientCard;
