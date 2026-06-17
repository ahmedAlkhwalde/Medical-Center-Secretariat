import { motion as Motion } from "framer-motion";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../../features/appointment/appointmentslice";

const ScheduleHeader = () => {
  const dispatch = useDispatch();

  return (
    <Motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-lg theme-gradient-panel"
    >
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 via-transparent to-orange-500/5" />
      <div className="relative p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl theme-accent text-white shadow-lg">
            <MedicalServicesIcon />
          </div>
          <div>
            <div className="text-xl font-black theme-text tracking-tight">إدارة الحجوزات</div>
            {/* <div className="text-xs theme-text-muted font-semibold">إدارة الحجوزات</div> */}
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
            className="w-full pr-10 pl-4 py-3 rounded-xl border theme-border theme-surface text-sm outline-none theme-text placeholder:text-(--color-grey) focus:ring-2 focus:ring-(--color-accent)"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>
    </Motion.header>
  );
};

export default ScheduleHeader;