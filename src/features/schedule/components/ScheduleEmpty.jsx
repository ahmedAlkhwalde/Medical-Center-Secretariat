import { SearchOff } from "@mui/icons-material";

const ScheduleEmpty = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="rounded-3xl bg-blue-500/10 p-4 text-blue-600 dark:text-blue-400">
      <SearchOff fontSize="large" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-bold theme-text">لا توجد بيانات</h3>
      <p className="text-sm theme-text-muted">
        لم يتم العثور على جداول زمنية تطابق معايير البحث الخاصة بك.
      </p>
    </div>
  </div>
);

export default ScheduleEmpty;
