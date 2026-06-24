import { motion as Motion } from "framer-motion";
import { NotificationsNone } from "@mui/icons-material";

const EmptyNotifications = () => (
  <Motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex h-72 flex-col items-center justify-center text-center border-2 border-dashed theme-border rounded-3xl p-8 theme-surface-90"
  >
    <div className="p-4 theme-surface rounded-full mb-3 theme-text-muted">
      <NotificationsNone className="h-10 w-10" />
    </div>
    <p className="text-base font-bold theme-text">صندوق الإشعارات فارغ حالياً</p>
    <p className="text-xs theme-text-muted mt-1.5 max-w-sm">
      عندما تتلقى تنبيهات جديدة من الإدارة أو رسائل شات فورية من المرضى ستظهر هنا تلقائياً.
    </p>
  </Motion.div>
);

export default EmptyNotifications;