import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleGrid from "./components/ScheduleGrid";
import BookingModal from "./components/BookingModal";
import {
  useSchedulesQuery,
  useSpecialtiesQuery,
} from "../../services/scheduleService";
import {
  setDoctorsSchedule,
  mapApiScheduleToFrontend,
  setSelectedYear,
  setSelectedMonth,
  setSelectedWeek,
} from "../../features/appointment/appointmentslice";

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

const AppointmentsPage = () => {
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
    isFetching: isLoading, // الاعتماد على الـ isFetching لضمان تفعيل الـ Loading مع كل تبديل فلتر
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
      // التعامل الآمن مع صيغة الـ API سواء كانت المصفوفة مباشرة أو مغلفة بداخل كائن (apiScheduleData.data)
      const rawSchedules = apiScheduleData.data || apiScheduleData;
      const formattedSchedule = mapApiScheduleToFrontend(rawSchedules);
      dispatch(setDoctorsSchedule(formattedSchedule));
    }
  }, [apiScheduleData, dispatch]);

  const weeksInMonth = useMemo(() => {
    return getWeeksInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const currentWeekDays = weeksInMonth[selectedWeek] || weeksInMonth[0] || [];

  // الحسبة الدقيقة: استخراج التاريخ بصيغة YYYY-MM-DD ومقاومة فوارق التوقيت (Timezone Safe)
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

    // العثور على أول يوم برقم حقيقي داخل الأسبوع الحالي للقياس عليه
    const validDay = currentWeekDays.find((d) => d.num > 0);
    if (!validDay) return null;

    const validDayIndex = currentWeekDays.findIndex((d) => d.num > 0);
    const dayDiff = dayIndexInWeek - validDayIndex;

    // بناء كائن تاريخ محلي وتثبيته عند الساعة 12 ظهراً لتفادي مشاكل الـ Daylight Saving Time
    const exactDate = new Date(selectedYear, monthIdx, validDay.num, 12, 0, 0);
    exactDate.setDate(exactDate.getDate() + dayDiff);

    const yyyy = exactDate.getFullYear();
    const mm = String(exactDate.getMonth() + 1).padStart(2, "0");
    const dd = String(exactDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [activeDoctor, currentWeekDays, selectedYear, selectedMonth]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* هيدر الصفحة الرئيسي - ثابت */}
      <ScheduleHeader />

      {/* شريط الفلاتر والتنقل - ثابت ومربوط بـ الـ UUIDs للاختصاصات */}
      <ScheduleFilters
        specialties={specialties}
        selectedYear={selectedYear}
        setSelectedYear={(year) => dispatch(setSelectedYear(year))}
        selectedMonth={selectedMonth}
        setSelectedMonth={(month) => dispatch(setSelectedMonth(month))}
        selectedWeek={selectedWeek}
        setSelectedWeek={(week) => dispatch(setSelectedWeek(week))}
        weeksInMonth={weeksInMonth}
      />

      {/* منطقة الجدول: يتم تحديثها وعمل Loading لها فقط بشكل مستقل */}
      {isLoading ? (
        /* هيكل تحميلي يحاكي أبعاد وشبكة الجدول الفعلي (Skeleton Loader) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full animate-pulse">
          {/* محاكاة أعمدة أيام الأسبوع الـ 7 */}
          {Array.from({ length: 7 }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="space-y-4 border theme-border rounded-3xl p-4 theme-surface bg-opacity-40 flex flex-col items-center justify-center min-h-[400px]"
            >
              {/* محاكاة عنوان اليوم (مثلاً: الأحد 15) */}
              <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded-lg w-2/3 mx-auto my-auto" />
              {/* محاكاة بطاقات الأطباء الموزعين داخل هذا اليوم */}
              {Array.from({ length: 2 }).map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="w-full max-w-[200px] p-4 border theme-border rounded-2xl bg-gray-100 dark:bg-zinc-800/50 space-y-3 mx-auto"
                >
                  {/* اسم الطبيب */}
                  <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-md w-3/4" />

                  {/* الاختصاص */}
                  <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-md w-1/2" />

                  {/* المواعيد والغرفة */}
                  <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 space-y-1">
                    <div className="h-2.5 bg-gray-200 dark:bg-zinc-700 rounded-md w-5/6" />
                    <div className="h-2.5 bg-gray-200 dark:bg-zinc-700 rounded-md w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-10 text-center text-red-500 font-bold border theme-border rounded-3xl theme-surface">
          حدث خطأ أثناء جلب المواعيد: {error?.message || "يرجى المحاولة لاحقاً"}
        </div>
      ) : (
        <ScheduleGrid
          currentWeekDays={currentWeekDays}
          setActiveDoctor={setActiveDoctor}
        />
      )}

      {/* مودال حجز وإدارة مواعيد الطبيب المختار */}
      {activeDoctor && (
        <BookingModal
          doctor={activeDoctor}
          selectedDate={selectedDateForModal}
          onClose={() => setActiveDoctor(null)}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
