import { useEffect, useMemo, useState } from "react";
import { WEEK_DAYS } from "../store/scheduleSlice";

const DAY_NAMES_EN = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

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
      uuid: shift?.uuid ?? null,
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

export const useScheduleDialog = ({
  open,
  schedule,
  doctorOptions = [],
  usedDoctorIds = [],
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(() => createInitialForm(schedule));
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(schedule?.id);

  useEffect(() => {
    if (!open) return;
    setForm(createInitialForm(schedule));
    setErrors({});
  }, [open, schedule?.id]);

  const getDoctorId = (doctor) =>
    doctor?.doctor_uuid ?? doctor?.uuid ?? doctor?.id;

  const selectedDoctor = useMemo(
    () => doctorOptions.find((doc) => getDoctorId(doc) === form.doctorId),
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
          { uuid: null, label: "", start: "", end: "" },
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

    if (!form.doctorId) nextErrors.doctorId = "اختر طبيباً من القائمة";
    else if (duplicateDoctor)
      nextErrors.doctorId =
        "يوجد دوام مسجل لهذا الطبيب بالفعل، استخدم التعديل بدلاً من الإضافة.";

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
    if (!hasAnyShift) nextErrors.schedule = "أضف فترة دوام واحدة على الأقل";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const schedules = [];
    WEEK_DAYS.forEach((day) => {
      const dayShifts = (form.weeklySchedule[day.key] || []).filter(
        (shift) => shift.start && shift.end,
      );
      dayShifts.forEach((shift) => {
        schedules.push({
          day_of_week: DAY_NAMES_EN[day.key],
          start_time: shift.start.substring(0, 5),
          end_time: shift.end.substring(0, 5),
        });
      });
    });

    onSave({
      doctor_uuid: form.doctorId,
      schedules,
    });
  };

  const disabledDoctorIds = new Set(
    usedDoctorIds.filter((doctorId) => doctorId !== editingDoctorId),
  );

  // معلومات العرض المساعدة
  const displayDoctorName = selectedDoctor
    ? selectedDoctor.doctor_name || selectedDoctor.name
    : schedule?.doctor?.name || "—";
  const displaySpecialty = selectedDoctor
    ? selectedDoctor.specialization?.name || selectedDoctor.specialization
    : schedule?.doctor?.specialization || "—";
  const displayClinic = selectedDoctor
    ? selectedDoctor.clinic?.name || selectedDoctor.clinic
    : schedule?.doctor?.clinic || "—";

  return {
    form,
    errors,
    isEditMode,
    selectedDoctor,
    disabledDoctorIds,
    displayDoctorName,
    displaySpecialty,
    displayClinic,
    setForm,
    updateShiftField,
    addShiftRow,
    removeShiftRow,
    handleSubmit,
    getDoctorId,
  };
};