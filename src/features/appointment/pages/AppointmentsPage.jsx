import { useAppointmentsPage } from "../hooks/useAppointmentsPage";
import ScheduleHeader from "../components/ScheduleHeader";
import ScheduleFilters from "../components/ScheduleFilters";
import ScheduleGrid from "../components/ScheduleGrid";
import BookingModal from "../components/BookingModal";

const AppointmentsPage = () => {
  const {
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
  } = useAppointmentsPage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* هيدر الصفحة الرئيسي - ثابت */}
      <ScheduleHeader />

      {/* شريط الفلاتر والتنقل - ثابت ومربوط بـ الـ UUIDs للاختصاصات */}
      <ScheduleFilters
        specialties={specialties}
        selectedYear={selectedYear}
        setSelectedYear={handleYearChange}
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        selectedWeek={selectedWeek}
        setSelectedWeek={handleWeekChange}
        weeksInMonth={weeksInMonth}
      />

      {/* منطقة الجدول: يتم تحديثها وعمل Loading لها فقط بشكل مستقل */}
      {isLoading ? (
        /* هيكل تحميلي يحاكي أبعاد وشبكة الجدول الفعلي (Skeleton Loader) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full animate-pulse">
          {Array.from({ length: 7 }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="space-y-4 border theme-border rounded-3xl p-4 theme-surface bg-opacity-40 flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded-lg w-2/3 mx-auto my-auto" />
              {Array.from({ length: 2 }).map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="w-full max-w-[200px] p-4 border theme-border rounded-2xl bg-gray-100 dark:bg-zinc-800/50 space-y-3 mx-auto"
                >
                  <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-md w-1/2" />
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