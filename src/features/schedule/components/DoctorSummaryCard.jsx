import { DeleteOutline, Edit } from "@mui/icons-material";
import { getShiftCount } from "./scheduleFormatters";

const DoctorSummaryCard = ({ item, onEdit, onDelete }) => (
  <div className="flex h-full flex-col w-full rounded-3xl border theme-border theme-surface p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-accent text-sm font-black text-white shadow-lg">
        {item.doctor.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold theme-text">
          {item.doctor.name}
        </p>
        <p className="text-xs font-medium theme-text-muted">
          {item.doctor.specialization}
        </p>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
        {item.doctor.clinic}
      </span>
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {getShiftCount(item.weeklySchedule)} فترات
      </span>
    </div>

    {(onEdit || onDelete) && (
      <div className="mt-3 flex flex-wrap gap-2">
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-2xl border theme-border theme-surface px-3 py-2 text-xs font-semibold theme-text transition-colors theme-hover-surface"
          >
            <Edit fontSize="small" />
            تعديل
          </button>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-300"
          >
            <DeleteOutline fontSize="small" />
            حذف
          </button>
        ) : null}
      </div>
    )}

    <p className="mt-auto pt-4 text-xs leading-6 theme-text-muted">
      {item.statusNote}
    </p>
  </div>
);

export default DoctorSummaryCard;
