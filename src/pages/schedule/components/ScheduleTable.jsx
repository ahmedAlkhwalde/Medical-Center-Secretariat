import { WEEK_DAYS } from "../../../features/schedule/scheduleSlice";
import ShiftCell from "./ShiftCell";
import DoctorSummaryCard from "./DoctorSummaryCard";

const ScheduleTable = ({
  filteredSchedule,
  onEditSchedule,
  onDeleteSchedule,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-310 w-full border-collapse text-right">
      <thead>
        <tr className="theme-surface-90 text-xs uppercase tracking-wide theme-text-muted">
          <th className="sticky right-0 z-20 w-1/4 border-b border-r theme-border px-5 py-4 font-semibold theme-surface-90">
            الطبيب
          </th>
          {WEEK_DAYS.map((day) => (
            <th
              key={day.key}
              className="border-b theme-border px-4 py-4 font-semibold"
            >
              {day.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {filteredSchedule.map((item) => (
          <tr
            key={item.id}
            className="border-t theme-border align-top transition-colors theme-hover-surface"
          >
            <td className="sticky right-0 z-10 w-1/4 border-r theme-border px-5 py-5 theme-surface-90">
              <DoctorSummaryCard
                item={item}
                onEdit={onEditSchedule ? () => onEditSchedule(item) : undefined}
                onDelete={
                  onDeleteSchedule ? () => onDeleteSchedule(item) : undefined
                }
              />
            </td>

            {WEEK_DAYS.map((day) => (
              <td key={day.key} className="px-3 py-5 align-top">
                <ShiftCell shift={item.weeklySchedule[day.key]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScheduleTable;