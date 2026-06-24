import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import {
  DAY_LABELS,
  TIME_SLOTS,
  getSpecialtyLabel,
  formatRoom,
} from "../../../features/appointment/store/appointmentslice";

const ScheduleGrid = ({ currentWeekDays, setActiveDoctor }) => {
  const { doctorsSchedule, selectedDoctorId, searchQuery } = useSelector(
    (state) => state.appointment,
  );

  const filteredSchedule = useMemo(() => {
    return (doctorsSchedule || []).filter((doc) => {
      // تمت إزالة فلترة التخصص محلياً لأن السيرفر يقوم بها بالكامل الآن بناءً على الـ UUID
      const matchDoc =
        selectedDoctorId === "All Doctors" || doc.id === selectedDoctorId;
      const matchSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchDoc && matchSearch;
    });
  }, [doctorsSchedule, selectedDoctorId, searchQuery]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-2xl"
    >
      <div className="overflow-x-auto">
        <div className="min-w-225">
          {/* رأس الأيام */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] theme-gradient-header border-b theme-border">
            <div className="flex items-center justify-center border-r theme-border py-5">
              <MoreTimeIcon className="theme-text-muted opacity-60" />
            </div>
            {currentWeekDays.map((day, idx) => (
              <div
                key={idx}
                className={`text-center py-5 border-r theme-border last:border-0 ${
                  !day.num ? "opacity-20" : ""
                }`}
              >
                <div className="text-xs font-black theme-text-muted mb-1 tracking-tighter">
                  {DAY_LABELS[day.short] || day.short}
                </div>
                <div className="text-2xl font-black theme-text">
                  {day.num || "-"}
                </div>
              </div>
            ))}
          </div>

          {/* الفترات الزمنية */}
          {TIME_SLOTS.map(({ value, label }) => (
            <div
              key={value}
              className="grid grid-cols-[80px_repeat(7,1fr)] border-b theme-border min-h-32"
            >
              <div className="flex items-start justify-center pt-6 border-r theme-border text-xs sm:text-sm font-bold theme-text-muted tracking-wide">
                {label}
              </div>
              {currentWeekDays.map((day, idx) => (
                <div
                  key={idx}
                  className="p-2 border-r theme-border last:border-0 relative theme-hover-surface transition-all"
                >
                  {/* تأكد أن كود الكارد داخل الـ Grid يبدو هكذا تماماً */}
                  {day.num &&
                    filteredSchedule
                      .filter((d) => d.day === day.short && d.time === value)
                      .map((doctor) => (
                        <Motion.div
                          key={doctor.scheduleUuid}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          // هنا يتم تمرير كائن الطبيب بالكامل والمبني بأمان من الـ Mapper
                          onClick={() => setActiveDoctor(doctor)}
                          className="p-3 sm:p-4 rounded-2xl shadow-md cursor-pointer transition-all mb-2 theme-surface border theme-border hover:shadow-lg hover:border-(--color-accent)"
                        >
                          <div className="text-sm font-black theme-text leading-tight tracking-wide">
                            {doctor.name}
                          </div>
                          <div className="text-xs theme-text-muted font-bold mt-1">
                            {getSpecialtyLabel(doctor.specialty)} •{" "}
                            {formatRoom(doctor.room)}
                          </div>
                        </Motion.div>
                      ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Motion.div>
  );
};

export default ScheduleGrid;
