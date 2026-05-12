import { motion as Motion } from "framer-motion";
import { Close, DeleteOutline, WarningAmber } from "@mui/icons-material";
import { getShiftCount } from "../scheduleFormatters";

const ScheduleDeleteDialog = ({ open, schedule, onClose, onConfirm }) => {
  if (!open || !schedule) {
    return null;
  }

  const shiftCount = getShiftCount(schedule.weeklySchedule);

  return (
    <div
      className="fixed inset-0 z-9200 flex items-center justify-center bg-[rgba(15,23,42,0.92)] p-4 dark:bg-[rgba(2,6,23,0.94)]"
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg overflow-hidden rounded-4xl border theme-border theme-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b theme-border px-5 py-4 md:px-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-rose-500/12 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <WarningAmber fontSize="small" />
              تأكيد الحذف
            </div>
            <h2 className="text-2xl font-black theme-text">حذف دوام الطبيب</h2>
            <p className="text-sm leading-7 theme-text-muted">
              هذا الإجراء سيحذف برنامج الدوام الخاص بهذا الطبيب من الجدول.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border theme-border theme-surface text-theme-text transition-colors hover:theme-hover-surface"
            aria-label="إغلاق نافذة الحذف"
          >
            <Close fontSize="small" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5 md:px-6">
          <div className="rounded-3xl border theme-border theme-surface p-4 shadow-sm">
            <p className="text-sm font-bold theme-text">
              {schedule.doctor.name}
            </p>
            <p className="mt-1 text-xs theme-text-muted">
              {schedule.doctor.specialization} - {schedule.doctor.clinic}
            </p>
            <p className="mt-3 text-xs theme-text-muted">
              عدد الفترات المسجلة: {shiftCount}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-surface px-5 py-3 text-sm font-semibold theme-text transition-colors theme-hover-surface"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-rose-700"
            >
              <DeleteOutline fontSize="small" />
              حذف الدوام
            </button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default ScheduleDeleteDialog;
