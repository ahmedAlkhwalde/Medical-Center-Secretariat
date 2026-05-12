import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  AddCircleOutline,
  Close,
  DeleteOutline,
  EventAvailable,
  Save,
} from "@mui/icons-material";
import {
  DOCTOR_OPTIONS,
  WEEK_DAYS,
} from "../../../features/schedule/scheduleSlice";

const createEmptyWeeklySchedule = () =>
  WEEK_DAYS.reduce((accumulator, day) => {
    accumulator[day.key] = [];
    return accumulator;
  }, {});

const normalizeWeeklySchedule = (weeklySchedule = {}) =>
  WEEK_DAYS.reduce((accumulator, day) => {
    const dayValue = weeklySchedule[day.key];
    const shifts = Array.isArray(dayValue)
      ? dayValue
      : dayValue
        ? [dayValue]
        : [];

    accumulator[day.key] = shifts.map((shift) => ({
      label: shift?.label ?? "",
      start: shift?.start ?? "",
      end: shift?.end ?? "",
    }));

    return accumulator;
  }, createEmptyWeeklySchedule());

const createInitialForm = (schedule) => ({
  doctorId: schedule?.doctorId ?? "",
  statusNote: schedule?.statusNote ?? "",
  weeklySchedule: schedule
    ? normalizeWeeklySchedule(schedule.weeklySchedule)
    : createEmptyWeeklySchedule(),
});

const ScheduleDialog = ({
  open,
  schedule,
  doctorOptions = DOCTOR_OPTIONS,
  usedDoctorIds = [],
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(() => createInitialForm(schedule));
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(schedule?.id);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(createInitialForm(schedule));
    setErrors({});
  }, [open, schedule?.id]);

  const selectedDoctor = useMemo(
    () => doctorOptions.find((doctor) => doctor.id === form.doctorId),
    [doctorOptions, form.doctorId],
  );

  const editingDoctorId = schedule?.doctorId ?? "";

  const updateShiftField = (dayKey, shiftIndex, field, value) => {
    setForm((currentForm) => {
      const nextDayShifts = (currentForm.weeklySchedule[dayKey] || []).map(
        (shift, currentIndex) =>
          currentIndex === shiftIndex ? { ...shift, [field]: value } : shift,
      );

      return {
        ...currentForm,
        weeklySchedule: {
          ...currentForm.weeklySchedule,
          [dayKey]: nextDayShifts,
        },
      };
    });
  };

  const addShiftRow = (dayKey) => {
    setForm((currentForm) => ({
      ...currentForm,
      weeklySchedule: {
        ...currentForm.weeklySchedule,
        [dayKey]: [
          ...(currentForm.weeklySchedule[dayKey] || []),
          { label: "", start: "", end: "" },
        ],
      },
    }));
  };

  const removeShiftRow = (dayKey, shiftIndex) => {
    setForm((currentForm) => ({
      ...currentForm,
      weeklySchedule: {
        ...currentForm.weeklySchedule,
        [dayKey]: (currentForm.weeklySchedule[dayKey] || []).filter(
          (_, currentIndex) => currentIndex !== shiftIndex,
        ),
      },
    }));
  };

  const validate = () => {
    const nextErrors = {};
    const duplicateDoctor =
      usedDoctorIds.includes(form.doctorId) &&
      form.doctorId !== editingDoctorId;

    if (!form.doctorId) {
      nextErrors.doctorId = "اختر طبيباً من القائمة";
    } else if (duplicateDoctor) {
      nextErrors.doctorId =
        "يوجد دوام مسجل لهذا الطبيب بالفعل، استخدم التعديل بدلاً من الإضافة.";
    }

    let hasAnyShift = false;

    for (const day of WEEK_DAYS) {
      const dayShifts = form.weeklySchedule[day.key] || [];

      for (const shift of dayShifts) {
        if (!shift.start || !shift.end) {
          nextErrors.schedule = `أكمل بيانات فترة يوم ${day.label}`;
          setErrors(nextErrors);
          return false;
        }

        if (shift.start >= shift.end) {
          nextErrors.schedule = `يجب أن تكون ساعة البداية قبل ساعة النهاية في يوم ${day.label}`;
          setErrors(nextErrors);
          return false;
        }

        hasAnyShift = true;
      }
    }

    if (!hasAnyShift) {
      nextErrors.schedule = "أضف فترة دوام واحدة على الأقل";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const weeklySchedule = WEEK_DAYS.reduce((accumulator, day) => {
      const dayShifts = (form.weeklySchedule[day.key] || [])
        .filter((shift) => shift.start && shift.end)
        .map((shift, index) => ({
          label: shift.label.trim() || `فترة ${index + 1}`,
          start: shift.start,
          end: shift.end,
        }));

      if (dayShifts.length > 0) {
        accumulator[day.key] = dayShifts;
      }

      return accumulator;
    }, {});

    onSave({
      doctorId: form.doctorId,
      doctor: selectedDoctor,
      weeklySchedule,
      statusNote: form.statusNote.trim(),
    });
  };

  if (!open) {
    return null;
  }

  const disabledDoctorIds = new Set(
    usedDoctorIds.filter((doctorId) => doctorId !== editingDoctorId),
  );

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.92)] p-4 pt-4 dark:bg-[rgba(2,6,23,0.94)] md:items-center md:p-6"
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-4xl border theme-border theme-surface shadow-2xl md:max-h-[calc(100vh-3rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b theme-border px-5 py-4 md:px-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-xs font-semibold theme-text-muted">
              <EventAvailable fontSize="small" />
              {schedule ? "تعديل برنامج دوام" : "إضافة برنامج دوام"}
            </div>
            <h2 className="text-2xl font-black theme-text">
              {schedule ? "تعديل دوام الطبيب" : "إضافة دوام لطبيب"}
            </h2>
            <p className="text-sm leading-7 theme-text-muted">
              اختر الطبيب من القائمة، ثم أضف أكثر من فترة في اليوم الواحد إذا
              لزم الأمر.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border theme-border theme-surface text-theme-text transition-colors hover:theme-hover-surface"
            aria-label="إغلاق النافذة"
          >
            <Close fontSize="small" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-6"
        >
          {errors.schedule ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/15 px-4 py-3 text-right text-sm font-medium text-rose-700 dark:text-rose-300">
              {errors.schedule}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold theme-text">
                اختيار الطبيب
              </span>
              {isEditMode ? (
                <div className="rounded-3xl border theme-border theme-surface px-4 py-3">
                  <p className="text-sm font-semibold theme-text">
                    {selectedDoctor?.name ?? schedule?.doctor?.name ?? "-"}
                  </p>
                  <p className="mt-1 text-xs theme-text-muted">
                    {selectedDoctor?.specialization ??
                      schedule?.doctor?.specialization ??
                      "-"}{" "}
                    -{" "}
                    {selectedDoctor?.clinic ?? schedule?.doctor?.clinic ?? "-"}
                  </p>
                  <p className="mt-2 text-xs font-medium theme-text-muted">
                    لا يمكن تغيير الطبيب أثناء التعديل.
                  </p>
                </div>
              ) : (
                <div className="relative rounded-3xl border theme-border theme-surface">
                  <select
                    value={form.doctorId}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        doctorId: event.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-3xl border-0 bg-transparent py-3 pr-4 pl-12 text-sm theme-text outline-none"
                  >
                    <option value="">اختر الطبيب من القائمة</option>
                    {doctorOptions.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                        disabled={disabledDoctorIds.has(doctor.id)}
                      >
                        {doctor.name} - {doctor.specialization} -{" "}
                        {doctor.clinic}
                      </option>
                    ))}
                  </select>
                  <AddCircleOutline
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                    fontSize="small"
                  />
                </div>
              )}
              {errors.doctorId ? (
                <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-300">
                  {errors.doctorId}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold theme-text">
                ملاحظة عن الدوام
              </span>
              <textarea
                value={form.statusNote}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    statusNote: event.target.value,
                  }))
                }
                rows={4}
                placeholder="مثال: دوام صباحي مع فترة مسائية إضافية عند الحاجة"
                className="w-full rounded-3xl border theme-border theme-surface px-4 py-3 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
              />
            </label>
          </div>

          {selectedDoctor ? (
            <div className="rounded-3xl border border-[color:var(--color-accent)]/35 theme-surface px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold theme-text">
                    {selectedDoctor.name}
                  </p>
                  <p className="text-xs theme-text-muted">
                    {selectedDoctor.specialization} - {selectedDoctor.clinic}
                  </p>
                </div>
                <span className="rounded-full theme-surface px-3 py-1 text-xs font-semibold theme-text-accent">
                  الطبيب المختار
                </span>
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-right">
                <h3 className="text-lg font-bold theme-text">
                  تفاصيل أيام الدوام
                </h3>
                <p className="text-sm theme-text-muted">
                  أضف فترة واحدة أو أكثر لكل يوم حسب جدول الطبيب.
                </p>
              </div>
              <div className="text-xs font-medium theme-text-muted">
                يمكن ربط صباح واحد ومسائي في اليوم نفسه.
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {WEEK_DAYS.map((day) => {
                const dayShifts = form.weeklySchedule[day.key] || [];

                return (
                  <section
                    key={day.key}
                    className="rounded-3xl border theme-border theme-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-right">
                        <h4 className="text-base font-bold theme-text">
                          {day.label}
                        </h4>
                        <p className="text-xs theme-text-muted">
                          أضف فترات متعددة لهذا اليوم إذا كان للطبيب دوامان.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addShiftRow(day.key)}
                        className="inline-flex items-center gap-2 rounded-2xl theme-accent px-3 py-2 text-xs font-semibold theme-text-on-accent transition-opacity hover:opacity-90"
                      >
                        <AddCircleOutline fontSize="small" />
                        إضافة فترة
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {dayShifts.length > 0 ? (
                        dayShifts.map((shift, shiftIndex) => (
                          <div
                            key={`${day.key}-${shiftIndex}`}
                            className="grid gap-3 rounded-2xl border theme-border theme-surface p-3 md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,0.8fr))_auto] md:items-end"
                          >
                            <label className="block">
                              <span className="mb-2 block text-xs font-semibold theme-text">
                                اسم الفترة
                              </span>
                              <input
                                type="text"
                                value={shift.label}
                                onChange={(event) =>
                                  updateShiftField(
                                    day.key,
                                    shiftIndex,
                                    "label",
                                    event.target.value,
                                  )
                                }
                                placeholder="صباحي / مسائي"
                                className="w-full rounded-2xl border theme-border theme-surface px-3 py-2 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-xs font-semibold theme-text">
                                من
                              </span>
                              <input
                                type="time"
                                value={shift.start}
                                onChange={(event) =>
                                  updateShiftField(
                                    day.key,
                                    shiftIndex,
                                    "start",
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-2xl border theme-border theme-surface px-3 py-2 text-sm theme-text outline-none transition-all"
                              />
                            </label>

                            <label className="block">
                              <span className="mb-2 block text-xs font-semibold theme-text">
                                إلى
                              </span>
                              <input
                                type="time"
                                value={shift.end}
                                onChange={(event) =>
                                  updateShiftField(
                                    day.key,
                                    shiftIndex,
                                    "end",
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-2xl border theme-border theme-surface px-3 py-2 text-sm theme-text outline-none transition-all"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                removeShiftRow(day.key, shiftIndex)
                              }
                              className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                              aria-label={`حذف فترة ${day.label}`}
                            >
                              <DeleteOutline fontSize="small" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed theme-border theme-surface px-4 py-5 text-sm theme-text-muted">
                          لا توجد فترات مضافة لهذا اليوم بعد.
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t theme-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-surface px-5 py-3 text-sm font-semibold theme-text transition-colors theme-hover-surface"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl theme-accent px-5 py-3 text-sm font-semibold theme-text-on-accent shadow-lg transition-opacity hover:opacity-90"
            >
              <Save fontSize="small" />
              {schedule ? "حفظ التعديلات" : "إضافة الدوام"}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

export default ScheduleDialog;
