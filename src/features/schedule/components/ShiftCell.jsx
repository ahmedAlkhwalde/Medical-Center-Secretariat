import { formatScheduleValue } from "./scheduleFormatters";

const normalizeShifts = (shift) => {
  if (Array.isArray(shift)) {
    return shift.filter(Boolean);
  }

  return shift ? [shift] : [];
};

const ShiftCell = ({ shift }) => {
  const shifts = normalizeShifts(shift);

  if (!shifts.length) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed theme-border theme-surface-90 px-3 py-4 text-xs font-semibold theme-text-muted">
        راحة
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {shifts.map((item, index) => (
        <div
          key={`${item.start}-${item.end}-${index}`}
          className={`rounded-2xl border px-3 py-3 shadow-sm ${
            item.variant === "modified"
              ? "border-amber-500/20 bg-amber-500/10 dark:border-amber-400/20"
              : "border-blue-500/15 theme-accent-soft dark:border-blue-400/20"
          }`}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <span className="inline-flex rounded-full theme-surface px-2.5 py-1 text-[11px] font-semibold theme-text-accent">
                {item.label || `فترة ${index + 1}`}
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-semibold uppercase tracking-wide">
              {/* <span
                className={`rounded-full px-2 py-1 ${
                  item.variant === "modified"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    : "theme-surface theme-text-accent"
                }`}
              >
                {item.variant === "modified" ? "معدل" : "أساسي"}
              </span> */}
              {item.isPermanent === false ? (
                <span className="rounded-full bg-slate-500/10 px-2 py-1 text-slate-600 dark:text-slate-300">
                  مؤقت
                </span>
              ) : null}
            </div>
          </div>

          {/* {item.swapType ? (
            <p className="mb-2 text-[11px] font-medium theme-text-muted">
              نوع التبديل: {item.swapType}
            </p>
          ) : null} */}

          {item.startDate || item.endDate ? (
            <p className="mb-2 text-[11px] font-medium theme-text-muted">
              الفترة: {formatScheduleValue(item.startDate)}
              {item.endDate ? ` - ${formatScheduleValue(item.endDate)}` : ""}
            </p>
          ) : null}

          {item.variant === "modified" && item.doctorName ? (
            <p className="mb-2 rounded-xl bg-white/70 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 dark:bg-slate-950/30 dark:text-amber-300">
              تم تعديل هذا الجزء من الجدول
            </p>
          ) : null}

          <div className="space-y-1 text-xs font-medium theme-text">
            <p className="rounded-xl theme-surface px-2.5 py-1.5">
              من {formatScheduleValue(item.start)}
            </p>
            <p className="rounded-xl theme-surface px-2.5 py-1.5">
              إلى {formatScheduleValue(item.end)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShiftCell;
