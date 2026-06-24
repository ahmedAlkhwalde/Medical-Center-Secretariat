import { motion as Motion } from "framer-motion";
import { WEEK_DAYS } from "../store/scheduleSlice";
import ShiftCell from "./ShiftCell";
import DoctorSummaryCard from "./DoctorSummaryCard";

const ScheduleGrid = ({
  filteredSchedule,
  onEditSchedule,
  onDeleteSchedule,
}) => (
  <div className="grid grid-cols-1 gap-4">
    {filteredSchedule.map((item) => (
      <Motion.article
        key={item.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-lg"
      >
        {/* حاوية الصف الأفقي: الجانب (1/4) للطبيب، الجانب (3/4) للأيام */}
        <div className="flex flex-col lg:flex-row">
          {/* عمود معلومات الطبيب */}
          <div className="lg:w-1/4 border-b lg:border-b-0 lg:border-l theme-border px-4 py-4">
            <DoctorSummaryCard
              item={item}
              onEdit={onEditSchedule ? () => onEditSchedule(item) : undefined}
              onDelete={
                onDeleteSchedule ? () => onDeleteSchedule(item) : undefined
              }
            />
          </div>

          {/* شبكة الأيام */}
          <div className="lg:w-3/4 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {WEEK_DAYS.map((day) => (
                <div key={day.key} className="space-y-2">
                  <div className="text-xs font-bold theme-text-muted text-center">
                    {day.label}
                  </div>
                  <ShiftCell shift={item.weeklySchedule[day.key]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Motion.article>
    ))}
  </div>
);

export default ScheduleGrid;
