import { motion as Motion } from "framer-motion";
import { WEEK_DAYS } from "../../../features/schedule/scheduleSlice";
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
        <div className="border-b theme-border px-4 py-4">
          <DoctorSummaryCard
            item={item}
            onEdit={onEditSchedule ? () => onEditSchedule(item) : undefined}
            onDelete={
              onDeleteSchedule ? () => onDeleteSchedule(item) : undefined
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          {WEEK_DAYS.map((day) => (
            <div key={day.key} className="space-y-2">
              <div className="text-xs font-bold theme-text-muted">
                {day.label}
              </div>
              <ShiftCell shift={item.weeklySchedule[day.key]} />
            </div>
          ))}
        </div>
      </Motion.article>
    ))}
  </div>
);

export default ScheduleGrid;
