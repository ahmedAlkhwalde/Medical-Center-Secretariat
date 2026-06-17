import React, { useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import TodayIcon from "@mui/icons-material/Today";
import {
  MONTHS,
  MONTHS_AR,
  YEARS,
  setSpecialty,
  setDoctorFilter,
  resetToToday,
} from "../../../features/appointment/appointmentslice";

const ScheduleFilters = ({
  specialties, // استقبال التخصصات هنا
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  weeksInMonth,
}) => {
  const dispatch = useDispatch();
  const { doctorsSchedule, selectedSpecialty, selectedDoctorId } = useSelector(
    (state) => state.appointment
  );

  // حساب قيم تاريخ اليوم الحالي الحقيقي بدقة للمقارنة الشرطية
  const todayObj = useMemo(() => new Date(), []);
  const actualYear = todayObj.getFullYear();
  const actualMonth = MONTHS[todayObj.getMonth()];
  const actualWeek = useMemo(() => {
    const firstDay = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1);
    const dayOfWeek = firstDay.getDay();
    return Math.floor((todayObj.getDate() + dayOfWeek - 1) / 7);
  }, [todayObj]);

  // فحص ما إذا كان تصفح المستخدم الحالي يختلف عن تاريخ اليوم الفعلي
  const isChangedFromToday =
    selectedYear !== actualYear ||
    selectedMonth !== actualMonth ||
    selectedWeek !== actualWeek;

  // دالة العودة إلى اليوم وتحديث الحالة المحلية والـ Redux معاً
  const handleResetToToday = () => {
    setSelectedYear(actualYear);
    setSelectedMonth(actualMonth);
    setSelectedWeek(actualWeek);
    dispatch(resetToToday());
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap items-center gap-3 theme-surface rounded-3xl p-2 shadow-sm border theme-border"
    >
    
      <div className="h-6 w-px theme-border hidden sm:block" />

      {/* السنة */}
      <select
        value={selectedYear}
        onChange={(e) => { setSelectedYear(Number(e.target.value)); setSelectedWeek(0); }}
        className="text-xs sm:text-sm font-semibold theme-text theme-surface rounded-xl py-2.5 px-3 outline-none cursor-pointer border theme-border"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* الشهر */}
      <select
        value={selectedMonth}
        onChange={(e) => { setSelectedMonth(e.target.value); setSelectedWeek(0); }}
        className="text-xs sm:text-sm font-semibold theme-text theme-surface rounded-xl py-2.5 px-3 outline-none cursor-pointer border theme-border"
      >
        {MONTHS.map((m, idx) => (
          <option key={m} value={m}>{MONTHS_AR[idx]}</option>
        ))}
      </select>

      {/* الأسابيع */}
      <div className="flex flex-wrap gap-1 theme-bg p-1.5 rounded-xl">
        {weeksInMonth.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWeek(idx)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all ${
              selectedWeek === idx
                ? "theme-accent text-white shadow-md"
                : "theme-text-muted hover:theme-surface hover:theme-text"
            }`}
          >
            أسبوع {idx + 1}
          </button>
        ))}
      </div>

      <div className="h-6 w-px theme-border hidden sm:block" />

      {/* فلتر التخصص الديناميكي القادم من الـ API */}
      <select
        value={selectedSpecialty}
        onChange={(e) => dispatch(setSpecialty(e.target.value))}
        className="text-xs sm:text-sm font-semibold theme-text-accent theme-accent-soft rounded-xl py-2.5 px-3 outline-none cursor-pointer border-none"
      >
        <option value="all">كل التخصصات</option>
        {specialties.map((spec) => (
          <option key={spec.uuid} value={spec.uuid}>
            {spec.name}
          </option>
        ))}
      </select>

      {/* زر العودة التلقائية لتاريخ اليوم الحالي */}
      <AnimatePresence>
        {isChangedFromToday && (
          <Motion.button
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleResetToToday}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black theme-accent-soft theme-text-accent border theme-border hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <TodayIcon sx={{ fontSize: 16 }} />
            اليوم
          </Motion.button>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default ScheduleFilters;