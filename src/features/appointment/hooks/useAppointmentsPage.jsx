import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSchedulesQuery,
  useSpecialtiesQuery,
} from "../../schedule/service/scheduleService";
import {
  setDoctorsSchedule,
  mapApiScheduleToFrontend,
  setSelectedYear,
  setSelectedMonth,
  setSelectedWeek,
} from "../store/appointmentslice";

// دالة حساب أسابيع الشهر وتوزيع الأيام عليها بشكل صحيح
const getWeeksInMonth = (year, monthName) => {
  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };
  const month = monthMap[monthName] ?? 4;
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let currentWeek = Array(7).fill({ short: "", num: 0 });
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const dayIndex = date.getDay();

    currentWeek[dayIndex] = { short: dayNames[dayIndex], num: d };

    if (dayIndex === 6 || d === lastDay.getDate()) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill({ short: "", num: 0 });
    }
  }

  if (weeks[0] && weeks[0][6].num === 0) {
    const indexedNames = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
    weeks[0] = weeks[0].map((item, idx) =>
      item.short ? item : { short: indexedNames[idx], num: 0 },
    );
  }

  return weeks;
};

export const useAppointmentsPage = () => {
  const dispatch = useDispatch();
  const [activeDoctor, setActiveDoctor] = useState(null);

  // جلب حالات الفلاتر من الـ Redux Store
  const { selectedYear, selectedMonth, selectedWeek, selectedSpecialty } =
    useSelector((state) => state.appointment);

  // 1. جلب قائمة التخصصات ديناميكياً من الـ API لملء شريط الفلاتر
  const { data: specialties = [] } = useSpecialtiesQuery();

  // 2. جلب المواعيد: عند اختيار "all" أو عندما تكون القيمة فارغة، نمرر undefined لعدم إرسال أي باراميتر مطلقاً
  const {
    data: apiScheduleData,
    isFetching: isLoading,
    isError,
    error,
  } = useSchedulesQuery(
    selectedSpecialty === "all" || !selectedSpecialty
      ? undefined
      : selectedSpecialty,
  );

  // مزامنة المواعيد مع Redux عند تحميل البيانات من السيرفر
  useEffect(() => {
    if (apiScheduleData) {
      const rawSchedules = apiScheduleData.data || apiScheduleData;
      const formattedSchedule = mapApiScheduleToFrontend(rawSchedules);
      dispatch(setDoctorsSchedule(formattedSchedule));
    }
  }, [apiScheduleData, dispatch]);

  const weeksInMonth = useMemo(() => {
    return getWeeksInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const currentWeekDays = weeksInMonth[selectedWeek] || weeksInMonth[0] || [];

  // الحسبة الدقيقة: استخراج التاريخ بصيغة YYYY-MM-DD ومقاومة فوارق التوقيت
  const selectedDateForModal = useMemo(() => {
    if (!activeDoctor || !activeDoctor.day) return null;

    const monthMapIndex = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    const monthIdx = monthMapIndex[selectedMonth] ?? 4;
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const doctorDayUpper = activeDoctor.day.toUpperCase();
    const dayIndexInWeek = dayNames.indexOf(doctorDayUpper);

    if (dayIndexInWeek === -1) return null;

    const validDay = currentWeekDays.find((d) => d.num > 0);
    if (!validDay) return null;

    const validDayIndex = currentWeekDays.findIndex((d) => d.num > 0);
    const dayDiff = dayIndexInWeek - validDayIndex;

    const exactDate = new Date(selectedYear, monthIdx, validDay.num, 12, 0, 0);
    exactDate.setDate(exactDate.getDate() + dayDiff);

    const yyyy = exactDate.getFullYear();
    const mm = String(exactDate.getMonth() + 1).padStart(2, "0");
    const dd = String(exactDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [activeDoctor, currentWeekDays, selectedYear, selectedMonth]);

  // دوال تغيير الفلاتر
  const handleYearChange = useCallback(
    (year) => dispatch(setSelectedYear(year)),
    [dispatch],
  );
  const handleMonthChange = useCallback(
    (month) => dispatch(setSelectedMonth(month)),
    [dispatch],
  );
  const handleWeekChange = useCallback(
    (week) => dispatch(setSelectedWeek(week)),
    [dispatch],
  );

  return {
    activeDoctor,
    setActiveDoctor,
    selectedYear,
    selectedMonth,
    selectedWeek,
    specialties,
    isLoading,
    isError,
    error,
    weeksInMonth,
    currentWeekDays,
    selectedDateForModal,
    handleYearChange,
    handleMonthChange,
    handleWeekChange,
  };
};