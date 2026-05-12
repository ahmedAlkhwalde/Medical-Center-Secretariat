import {
  CalendarMonth,
  AccessTime,
  MedicalServices,
  AddCircleOutline,
} from "@mui/icons-material";
import { motion as Motion } from "framer-motion";
import { useMemo } from "react";
import { getShiftCount } from "../scheduleFormatters";

const ScheduleHeader = ({ schedules, specialtyOptions, onAddSchedule }) => {
  const stats = useMemo(() => {
    const totalShiftSlots = schedules.reduce((sum, item) => {
      return sum + getShiftCount(item.weeklySchedule);
    }, 0);

    const coveredDays = new Set();
    schedules.forEach((item) => {
      Object.entries(item.weeklySchedule).forEach(([dayKey, dayShifts]) => {
        const hasShifts = Array.isArray(dayShifts)
          ? dayShifts.filter(Boolean).length > 0
          : Boolean(dayShifts);

        if (hasShifts) {
          coveredDays.add(dayKey);
        }
      });
    });

    return [
      {
        id: 1,
        label: "إجمالي الأطباء",
        value: schedules.length,
        note: "بطاقات الأطباء المعروضة في الجدول",
        icon: <CalendarMonth />,
      },
      {
        id: 2,
        label: "فترات الدوام",
        value: totalShiftSlots,
        note: "إجمالي الفترات الأسبوعية المسجلة",
        icon: <AccessTime />,
      },
      {
        id: 3,
        label: "أيام مغطاة",
        value: coveredDays.size,
        note: "الأيام التي تحتوي على دوام فعلي",
        icon: <MedicalServices />,
      },
      {
        id: 4,
        label: "الاختصاصات",
        value: specialtyOptions.length,
        note: "الاختصاصات المتوفرة داخل البرنامج",
        icon: <MedicalServices />,
      },
    ];
  }, [schedules, specialtyOptions.length]);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-4xl border theme-border theme-surface-90 shadow-2xl"
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-xs font-semibold theme-text-muted">
                <CalendarMonth fontSize="small" />
                البرنامج الأسبوعي للدوام
              </div>

              {onAddSchedule ? (
                <button
                  type="button"
                  onClick={onAddSchedule}
                  className="inline-flex items-center gap-2 rounded-2xl theme-accent px-4 py-2.5 text-sm font-semibold theme-text-on-accent shadow-lg transition-opacity hover:opacity-90"
                >
                  <AddCircleOutline fontSize="small" />
                  إضافة دوام
                </button>
              ) : null}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                جدول الأطباء الأسبوعي
              </h1>
              <p className="max-w-xl text-sm leading-7 theme-text-muted md:text-base">
                الأعمدة تمثل أيام الأسبوع، ويمكن لكل طبيب أن يضم أكثر من فترة
                دوام في اليوم الواحد حسب الحاجة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-3xl border theme-border theme-surface px-4 py-4 text-right shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-2xl bg-linear-to-r from-blue-500/15 to-cyan-500/15 p-2 theme-text">
                    {stat.icon}
                  </span>
                  <span className="text-xs font-medium theme-text-muted">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-black theme-text">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-5 theme-text-muted">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Motion.section>
  );
};

export default ScheduleHeader;
