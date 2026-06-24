import { motion as Motion } from "framer-motion";
import { Edit } from "@mui/icons-material";

const ProfileHeader = ({ isEditing, onEdit }) => (
  <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1 text-right">
        <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
          الملف الشخصي
        </h1>
        <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
          إدارة معلومات حسابك الشخصي وتحديثها وتغيير كلمة المرور بسهولة.
        </p>
      </div>
      {!isEditing && (
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-2 rounded-xl theme-accent px-5 py-2.5 text-sm font-bold theme-text-on-accent shadow-lg self-end"
        >
          <Edit fontSize="small" />
          تعديل البيانات
        </Motion.button>
      )}
    </div>
  </div>
);

export default ProfileHeader;