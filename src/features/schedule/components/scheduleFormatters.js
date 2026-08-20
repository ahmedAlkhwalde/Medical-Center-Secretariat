export const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

export const formatTimeTo24Hour = (value) => {
  if (!value) return "";

  const text = value.toString().trim();
  const amPmMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])$/);
  if (amPmMatch) {
    let hours = Number(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();

    if (period === "AM") {
      hours = hours === 12 ? 0 : hours;
    } else if (hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  const twentyFourHourMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHourMatch) {
    return `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${twentyFourHourMatch[2]}`;
  }

  return text;
};

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
    return formatTimeTo24Hour(value);
  }

  if (/^\d{1,2}:\d{2}\s*[AaPp][Mm]$/.test(value)) {
    return formatTimeTo24Hour(value);
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
