import React, { useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// --- استيراد أيقونات MUI التي طلبتها ---
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CallIcon from "@mui/icons-material/Call";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaymentsIcon from "@mui/icons-material/Payments";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
const YEARS = [2024, 2025, 2026, 2027];
const DAY_LABELS = {
  SAT: "السبت",
  SUN: "الأحد",
  MON: "الإثنين",
  TUE: "الثلاثاء",
  WED: "الأربعاء",
  THU: "الخميس",
  FRI: "الجمعة",
};
const TIME_SLOTS = [
  { value: "from : 8:00 to : 2:00", label: "من 8:00 إلى 2:00" },
  { value: "from : 4:00 to : 10:00", label: "من 4:00 إلى 10:00" },
];
const DAY_INDEX = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};
const SPECIALTY_LABELS = {
  Surgery: "جراحة",
  "Internal Medicine": "باطنة",
  Pediatrics: "أطفال",
};
const GENDER_LABELS = {
  Male: "ذكر",
  Female: "أنثى",
};

const getDayLabel = (day) => DAY_LABELS[day] || day;
const getSpecialtyLabel = (value) => SPECIALTY_LABELS[value] || value;
const getGenderLabel = (value) => GENDER_LABELS[value] || value;
const parseStartTime = (value) => {
  if (!value) return null;
  const match = value.match(/\d{1,2}:\d{2}/);
  return match ? match[0] : null;
};
const formatRoom = (value) => (value ? `غرفة ${value}` : "");

import {
  addPatient,
  addAppointment,
  deleteAppointment,
  setSpecialty,
  setDoctorFilter,
  setSearchQuery,
  updatePaymentStatus,
} from "../../features/appointment/appointmentslice";

// --- BookingModal Component ---
const BookingModal = ({ doctor, onClose }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { patients, appointments } = useSelector((state) => state.appointment);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "Male",
  });
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPatients = (patients || []).filter((p) =>
    (p?.name || "").toLowerCase().includes(normalizedSearch),
  );

  const getFormattedDate = (dayName) => {
    const now = new Date();
    const currentDayIndex = now.getDay();
    const targetDayIndex = DAY_INDEX[dayName];
    if (targetDayIndex === undefined) {
      return now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    const diff = targetDayIndex - currentDayIndex;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    return targetDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const { top, bottom } = container.getBoundingClientRect();
    if (e.clientY < top + 80) container.scrollTop -= 20;
    else if (e.clientY > bottom - 80) container.scrollTop += 20;
  };

  const slots = useMemo(() => {
    const startTime = parseStartTime(doctor?.time);
    if (!startTime) return [];
    const timeSlots = [];
    let [hours, minutes] = startTime.split(":").map(Number);
    for (let i = 0; i < 10; i++) {
      timeSlots.push(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      );
      minutes += 15;
      if (minutes >= 60) {
        hours++;
        minutes = 0;
      }
    }
    return timeSlots;
  }, [doctor]);

  const handleDrop = (e, targetSlot) => {
    e.preventDefault();
    const targetBooking = appointments.find(
      (a) => a.doctorId === doctor.id && a.timeSlot === targetSlot,
    );
    if (targetBooking?.isPaid) return;
    const patientData = e.dataTransfer.getData("patient");
    const moveData = e.dataTransfer.getData("moveAppointment");
    const actualDate = getFormattedDate(doctor.day);
    const fullBookingDate = `${getDayLabel(doctor.day)} (${actualDate})`;

    if (patientData) {
      const p = JSON.parse(patientData);
      dispatch(
        addAppointment({
          doctorId: doctor.id,
          patientId: p.id,
          timeSlot: targetSlot,
          patientName: p.name,
          phone: p.phone,
          bookingDate: fullBookingDate,
          gender: p.gender,
          isPaid: false,
        }),
      );
    } else if (moveData) {
      const { fromSlot, patient } = JSON.parse(moveData);
      if (fromSlot === targetSlot) return;
      dispatch(deleteAppointment({ doctorId: doctor.id, timeSlot: fromSlot }));
      dispatch(
        addAppointment({
          ...patient,
          timeSlot: targetSlot,
          bookingDate: fullBookingDate,
        }),
      );
    }
  };

  if (!doctor) {
    return null;
  }

  const dayLabel = getDayLabel(doctor.day);
  const specialtyLabel = getSpecialtyLabel(doctor.specialty);

  return (
    <div
  // قمنا بإزالة top-12 و sm:top-16 لتبدأ النافذة من نقطة الصفر في الأعلى
  className="fixed inset-0 theme-overlay backdrop-blur-md flex items-center justify-center p-0 sm:p-4" 
  style={{ zIndex: 9999 }} // رفعنا قيمة zIndex لضمان ظهورها فوق كل شيء
>
      <div className="theme-surface w-full max-w-6xl rounded-3xl border theme-border shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row-reverse max-h-[85vh]">
          <aside className="theme-surface-90 lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-l theme-border p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <PersonAddIcon className="theme-text-accent" />
              <h3 className="text-lg font-black theme-text">سجل المرضى</h3>
            </div>
            <input
              type="text"
              placeholder="ابحث بالاسم..."
              className="w-full px-4 py-2 rounded-2xl border-none shadow-inner theme-surface theme-text text-sm mb-4 outline-none text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-1 no-scrollbar">
              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("patient", JSON.stringify(p))
                  }
                  className="p-3 rounded-2xl theme-surface border-2 theme-border cursor-grab shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:opacity-90"
                >
                  <div className="font-black theme-text text-sm leading-tight">
                    {p.name}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs theme-text-muted font-bold">
                    <span className="flex items-center gap-1">
                      <CallIcon sx={{ fontSize: 14 }} />
                      {p.phone}
                    </span>
                    <span className="theme-accent-soft theme-text-accent px-2.5 py-1 rounded-lg text-[11px] font-black">
                      {getGenderLabel(p.gender)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-surface border theme-border rounded-3xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black theme-text-accent tracking-wide">
                  تسجيل مريض جديد
                </span>
                <span className="text-[10px] theme-text-muted font-bold">
                  سريع
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold theme-text-muted block mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    placeholder="أحمد محمد"
                    className="w-full p-2.5 theme-bg rounded-lg text-xs border border-gray-300 outline-none placeholder:text-gray-400 theme-text focus:border-theme-accent"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold theme-text-muted block mb-1">
                    الهاتف
                  </label>
                  <input
                    type="text"
                    placeholder="05XXXXXXXXX"
                    className="w-full p-2.5 theme-bg rounded-lg text-xs border border-gray-300 outline-none placeholder:text-gray-400 theme-text focus:border-theme-accent"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold theme-text-muted block mb-1">
                    الميلاد
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 theme-bg rounded-lg text-xs border border-gray-300 theme-text outline-none focus:border-theme-accent"
                    value={newPatient.dob}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, dob: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold theme-text-muted block mb-1">
                    النوع
                  </label>
                  <select
                    className="w-full p-2.5 theme-bg rounded-lg text-xs border border-gray-300 theme-text outline-none focus:border-theme-accent cursor-pointer"
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                  >
                    <option value="Male">ذكر</option>
                    <option value="Female">أنثى</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (newPatient.name && newPatient.phone) {
                      dispatch(addPatient({ ...newPatient, id: Date.now() }));
                      setNewPatient({
                        name: "",
                        phone: "",
                        dob: "",
                        gender: "Male",
                      });
                      setSearchTerm("");
                    }
                  }}
                  className="col-span-2 w-full py-2.5 theme-accent theme-text-on-accent font-black rounded-xl text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <PersonAddIcon sx={{ fontSize: 18 }} />
                  إضافة المريض
                </button>
              </div>
            </div>
          </aside>

          <div
            ref={scrollRef}
            onDragOver={handleDragOver}
            className="flex-1 space-y-4 overflow-y-auto no-scrollbar p-5 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black theme-text tracking-tight">
                  {doctor.name}
                </h2>
                <p className="theme-text-muted font-bold text-sm mt-2 flex items-center gap-2">
                  <CalendarMonthIcon
                    className="theme-text-accent"
                    sx={{ fontSize: 18 }}
                  />
                  {specialtyLabel} • {dayLabel} • الأسبوع الحالي
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-xl theme-surface border theme-border theme-text-muted theme-hover-text-accent text-xs font-bold"
              >
                <CancelIcon sx={{ fontSize: 18 }} />
                إغلاق التفاصيل
              </button>
            </div>

            <div className="grid gap-3">
              {slots.map((slot) => {
                const booking = appointments.find(
                  (a) => a.doctorId === doctor.id && a.timeSlot === slot,
                );
                const isPaid = !!booking?.isPaid;
                return (
                  <div
                    key={slot}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, slot)}
                    draggable={booking && !isPaid}
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "moveAppointment",
                        JSON.stringify({ fromSlot: slot, patient: booking }),
                      )
                    }
                    className={`relative p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${booking ? (isPaid ? "theme-border theme-accent-soft" : "theme-border theme-surface shadow-2xl ring-8 theme-bg") : "border-dashed theme-border theme-bg/20"}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                      <div
                        className={`text-2xl sm:text-3xl font-black ${isPaid ? "theme-text-accent" : booking ? "theme-text" : "opacity-30 theme-text"}`}
                      >
                        {slot}
                      </div>
                      {booking ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-lg sm:text-xl font-black theme-text leading-none">
                              {booking.patientName}
                            </span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-black text-white shadow-sm ${booking.gender === "Female" ? "bg-pink-500" : "bg-blue-500"}`}
                            >
                              {getGenderLabel(booking.gender)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm font-bold theme-text-muted mt-1">
                            <span className="flex items-center gap-1.5">
                              <CallIcon
                                className="theme-text-accent"
                                sx={{ fontSize: 16 }}
                              />
                              {booking.phone}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <EventAvailableIcon
                                className="theme-text-accent"
                                sx={{ fontSize: 16 }}
                              />
                              الحجز: {booking.bookingDate}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="theme-text-muted opacity-60 font-bold text-sm">
                          جاهز للحجز
                        </div>
                      )}
                    </div>
                    {booking && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch(
                              updatePaymentStatus({
                                doctorId: doctor.id,
                                timeSlot: slot,
                              }),
                            )
                          }
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-lg ${isPaid ? "theme-accent theme-text-on-accent" : "theme-surface border-2 theme-border theme-text-muted theme-hover-accent theme-hover-text-accent"}`}
                        >
                          {isPaid ? (
                            <VerifiedIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <PaymentsIcon sx={{ fontSize: 18 }} />
                          )}
                          {isPaid ? "مدفوع" : "تحصيل"}
                        </button>
                        {!isPaid && (
                          <button
                            onClick={() =>
                              dispatch(
                                deleteAppointment({
                                  doctorId: doctor.id,
                                  timeSlot: slot,
                                }),
                              )
                            }
                            className="w-11 h-11 flex items-center justify-center theme-text-muted theme-hover-danger rounded-2xl transition-all"
                          >
                            <DeleteForeverIcon sx={{ fontSize: 22 }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main MasterSchedule Component ---
const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const { doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery } =
    useSelector((state) => state.appointment);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [selectedWeek, setSelectedWeek] = useState(0);

  const monthIndex = MONTHS.indexOf(selectedMonth);
  const displayMonth = monthIndex >= 0 ? MONTHS_AR[monthIndex] : selectedMonth;

  const { weeksInMonth, currentWeekDays } = useMemo(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth);
    const lastDayOfMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const weeks = [];
    for (let i = 0; i < lastDayOfMonth; i += 7) weeks.push(i);
    const startNum = selectedWeek * 7 + 1;
    const daysLabels = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
    const days = daysLabels.map((d, index) => {
      const dayNumber = startNum + index;
      return { short: d, num: dayNumber <= lastDayOfMonth ? dayNumber : null };
    });
    return { weeksInMonth: weeks, currentWeekDays: days };
  }, [selectedYear, selectedMonth, selectedWeek]);

  const filteredSchedule = useMemo(() => {
    const schedule = doctorsSchedule || [];
    return schedule.filter((doc) => {
      const matchSpec =
        selectedSpecialty === "All Specialties" ||
        doc.specialty === selectedSpecialty;
      const matchDoc =
        selectedDoctorId === "All Doctors" ||
        doc.id.toString() === selectedDoctorId;
      const matchSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchSpec && matchDoc && matchSearch;
    });
  }, [doctorsSchedule, selectedSpecialty, selectedDoctorId, searchQuery]);

  return (
    <div
      dir="rtl"
      className="min-h-full font-sans theme-text overflow-x-hidden"
    >
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <header className="theme-surface-90 rounded-3xl border theme-border p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <MedicalServicesIcon className="theme-text-accent" />
              <div>
                <div className="text-xl font-black theme-text">
                  كلينيك كونكت
                </div>
                <div className="text-xs theme-text-muted font-bold">
                  إدارة الحجوزات
                </div>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <SearchIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted"
                sx={{ fontSize: 18 }}
              />
              <input
                type="text"
                placeholder="ابحث عن طبيب..."
                className="w-full pr-10 pl-4 py-2 theme-surface border-none shadow-sm rounded-xl text-sm outline-none theme-text text-right"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>
          </header>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black theme-text tracking-tight leading-tight">
                الجدول الأسبوعي للحجوزات
              </h1>
              <p className="theme-text-muted text-sm font-bold mt-1 tracking-wide">
                إدارة القسم • {displayMonth} {selectedYear}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 theme-surface p-3 rounded-3xl shadow-sm border theme-border w-full lg:w-auto">
              <select
                value={selectedDoctorId}
                onChange={(e) => dispatch(setDoctorFilter(e.target.value))}
                className="w-full sm:w-auto text-xs sm:text-sm font-black theme-text-muted theme-bg border-none rounded-lg p-2.5 outline-none cursor-pointer text-right"
              >
                <option value="All Doctors">كل الأطباء</option>
                {Array.from(
                  new Set((doctorsSchedule || []).map((d) => d.name)),
                ).map((name) => {
                  const doc = (doctorsSchedule || []).find(
                    (d) => d.name === name,
                  );
                  return (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  );
                })}
              </select>

              <div className="h-5 w-px theme-border hidden sm:block"></div>

              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedWeek(0);
                }}
                className="w-full sm:w-auto text-xs sm:text-sm font-black theme-text-muted theme-bg border-none rounded-lg p-2.5 outline-none cursor-pointer text-right"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedWeek(0);
                }}
                className="w-full sm:w-auto text-xs sm:text-sm font-black theme-text-muted theme-bg border-none rounded-lg p-2.5 outline-none cursor-pointer text-right"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={m}>
                    {MONTHS_AR[idx]}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap theme-bg p-1 rounded-xl w-full sm:w-auto">
                {weeksInMonth.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeek(idx)}
                    className={`px-3 py-1 text-xs sm:text-sm font-black rounded-lg transition-all ${selectedWeek === idx ? "theme-surface theme-text-accent shadow-sm" : "theme-text-muted theme-hover-text-accent"}`}
                  >
                    أسبوع {idx + 1}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px theme-border hidden sm:block"></div>

              <select
                value={selectedSpecialty}
                onChange={(e) => dispatch(setSpecialty(e.target.value))}
                className="w-full sm:w-auto text-xs sm:text-sm font-black theme-text-accent theme-accent-soft border-none rounded-lg p-2.5 outline-none cursor-pointer text-right"
              >
                <option value="All Specialties">كل التخصصات</option>
                <option value="Surgery">جراحة</option>
                <option value="Internal Medicine">باطنة</option>
                <option value="Pediatrics">أطفال</option>
              </select>
            </div>
          </div>

          <div className="theme-surface-90 rounded-3xl border theme-border shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-225">
                <div className="grid grid-cols-[80px_repeat(7,1fr)] theme-bg border-b theme-border">
                  <div className="flex items-center justify-center border-r theme-border py-6">
                    <MoreTimeIcon className="theme-text-accent opacity-60" />
                  </div>
                  {currentWeekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`text-center py-6 border-r theme-border last:border-0 ${!day.num ? "opacity-20" : ""}`}
                    >
                      <div className="text-xs font-black theme-text-accent opacity-70 mb-1 tracking-tighter">
                        {DAY_LABELS[day.short] || day.short}
                      </div>
                      <div className="text-2xl font-black theme-text">
                        {day.num || "-"}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  {TIME_SLOTS.map(({ value, label }) => (
                    <div
                      key={value}
                      className="grid grid-cols-[80px_repeat(7,1fr)] border-b theme-border min-h-35"
                    >
                      <div className="flex items-start justify-center pt-8 border-r theme-border text-xs sm:text-sm font-black theme-text-accent opacity-70 tracking-wide">
                        {label}
                      </div>
                      {currentWeekDays.map((day, idx) => (
                        <div
                          key={idx}
                          className="p-3 border-r theme-border last:border-0 relative theme-hover-surface transition-all"
                        >
                          {day.num &&
                            filteredSchedule
                              .filter(
                                (d) => d.day === day.short && d.time === value,
                              )
                              .map((doctor) => {
                                const specialtyLabel = getSpecialtyLabel(
                                  doctor.specialty,
                                );
                                const roomLabel = formatRoom(doctor.room);
                                return (
                                  <div
                                    key={doctor.id}
                                    onClick={() => setActiveDoctor(doctor)}
                                    className="p-4 sm:p-5 rounded-2xl border-r-4 shadow-sm cursor-pointer hover:scale-[1.01] transition-transform mb-2 theme-surface-90 theme-border theme-shadow-accent"
                                    style={{
                                      borderRightColor: "var(--color-accent)",
                                    }}
                                  >
                                    <div className="text-sm font-black theme-text leading-tight tracking-wide">
                                      {doctor.name}
                                    </div>
                                    <div className="text-xs theme-text-muted font-bold mt-1">
                                      {specialtyLabel} • {roomLabel}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {activeDoctor && (
        <BookingModal
          doctor={activeDoctor}
          onClose={() => setActiveDoctor(null)}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;

//
