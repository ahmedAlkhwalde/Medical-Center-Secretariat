import { motion as Motion } from "framer-motion";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleTable from "./ScheduleTable";
import ScheduleEmpty from "./ScheduleEmpty";

const ScheduleList = ({
  filteredSchedule,
  isMobile,
  hasActiveFilters,
  onEditSchedule,
  onDeleteSchedule,
}) => (
  <Motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="overflow-hidden rounded-4xl border theme-border theme-surface-90 shadow-2xl"
  >
    <div className="flex items-center justify-between border-b theme-border px-5 py-4 md:px-6">
      <div>
        <h2 className="text-lg font-bold theme-text">
          جدول الأطباء ({filteredSchedule.length})
        </h2>
        <p className="text-sm theme-text-muted">
          كل صف يمثل طبيباً، والأعمدة تمثل أيام الأسبوع مع أكثر من فترة دوام في
          اليوم إذا لزم الأمر.
        </p>
      </div>
      {hasActiveFilters && (
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          توجد فلاتر مفعلة
        </span>
      )}
    </div>

    <div className="p-5 md:p-6">
      {filteredSchedule.length > 0 ? (
        isMobile ? (
          <ScheduleGrid
            filteredSchedule={filteredSchedule}
            onEditSchedule={onEditSchedule}
            onDeleteSchedule={onDeleteSchedule}
          />
        ) : (
          <ScheduleTable
            filteredSchedule={filteredSchedule}
            onEditSchedule={onEditSchedule}
            onDeleteSchedule={onDeleteSchedule}
          />
        )
      ) : (
        <ScheduleEmpty />
      )}
    </div>
  </Motion.section>
);

export default ScheduleList;
