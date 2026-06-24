import { motion as Motion, AnimatePresence } from "framer-motion";
import { Notifications, DeleteSweep } from "@mui/icons-material";
import ButtonSpinner from "./ButtonSpinner";

const NotificationHeader = ({ notificationsCount, isFetching, onDeleteAll, isDeletingAll }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b theme-border pb-5">
    <div className="flex items-center gap-3.5">
      <div className="p-3 theme-accent-soft theme-text-accent rounded-2xl relative">
        <Notifications className="text-[26px]" />
        {isFetching && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-accent)]"></span>
          </span>
        )}
      </div>
      <div>
        <h1 className="text-xl font-black theme-text tracking-wide">مركز الإشعارات</h1>
        <p className="text-xs theme-text-muted mt-0.5">إدارة وتتبع تنبيهات النظام والمحادثات الحية</p>
      </div>
    </div>

    <AnimatePresence>
      {notificationsCount > 0 && (
        <Motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <button
            onClick={onDeleteAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold theme-text-danger theme-hover-danger rounded-xl border border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isDeletingAll ? <ButtonSpinner className="w-3.5 h-3.5 theme-text-danger" /> : <DeleteSweep fontSize="small" />}
            حذف جميع الإشعارات
          </button>
        </Motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default NotificationHeader;