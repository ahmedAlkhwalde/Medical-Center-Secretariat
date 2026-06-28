import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack, SearchOff } from "@mui/icons-material";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden theme-bg p-4">
      {/* عناصر زخرفية في الخلفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg"
      >
        {/* البطاقة الرئيسية */}
        <div className="overflow-hidden rounded-3xl border theme-border theme-surface shadow-2xl">
          {/* رأس البطاقة */}
          <div className="theme-gradient-panel px-6 py-8 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full theme-accent-soft"
            >
              <SearchOff
                sx={{
                  fontSize: 56,
                  color: "var(--color-accent)",
                  opacity: 0.8,
                }}
              />
            </motion.div>

            <h1 className="text-8xl font-black theme-text-accent leading-none tracking-tighter">
              404
            </h1>
            <p className="mt-3 text-2xl font-bold theme-text">
              الصفحة غير موجودة
            </p>
            <p className="mt-2 text-sm theme-text-muted max-w-xs mx-auto leading-relaxed">
              ربما تم تغيير عنوان الصفحة أو حذفها. تأكد من الرابط وحاول مجدداً.
            </p>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/main-page")}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl theme-accent px-6 py-3 text-sm font-bold theme-text-on-accent shadow-lg shadow-teal-500/20 transition-all hover:shadow-xl"
            >
              <Home fontSize="small" />
              العودة للرئيسية
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border theme-border theme-surface px-6 py-3 text-sm font-semibold theme-text transition-all hover:theme-hover-surface"
            >
              <ArrowBack fontSize="small" />
              العودة للخلف
            </motion.button>
          </div>
        </div>

        {/* نص سفلي */}
        <p className="mt-6 text-center text-xs theme-text-muted">
          مركز الشفاء الطبي © {new Date().getFullYear()} — نظام الإدارة المتكامل
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;