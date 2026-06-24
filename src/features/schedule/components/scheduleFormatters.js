export const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

export const formatScheduleValue = (value) => {
  if (!value) {
    return "-";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  }

  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
    const [hours = "00", minutes = "00"] = value.split(":");
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  return value;
};

export const getShiftCount = (weeklySchedule = {}) =>
  Object.values(weeklySchedule).reduce((count, shifts) => {
    if (Array.isArray(shifts)) {
      return count + shifts.filter(Boolean).length;
    }

    return shifts ? count + 1 : count;
  }, 0);
