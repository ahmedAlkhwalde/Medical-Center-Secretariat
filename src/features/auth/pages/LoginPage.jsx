import { Link } from "react-router-dom";
import { useLoginForm } from "../hooks/useLoginForm"; // استيراد الهوك المطور
import AuthInput from "../Components/AuthInput";
import { motion as Motion } from "framer-motion";
import LoginIcon from "@mui/icons-material/Login";

const LoginPage = () => {
  // استدعاء البيانات والأكشنز الجاهزة من الـ Controller
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    rememberMe,
    isPending,
    handleLogin,
    handleToggleRememberMe,
  } = useLoginForm();

  return (
    <div
      dir="rtl"
      className="h-screen w-full flex items-center justify-center theme-bg p-4 overflow-hidden"
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-250 theme-surface rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row border theme-border overflow-hidden"
      >
        {/* القسم الجمالي الأيسر */}
        <div className="hidden md:flex md:w-1/2 theme-accent p-12 flex-col justify-center relative">
          <Motion.h1
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black theme-text-on-accent mb-6 leading-tight"
          >
            إدارة الاستقبال <br /> مركز الشفاء
          </Motion.h1>
          <p className="text-lg theme-text-on-accent opacity-80 font-medium leading-relaxed">
            منصتكِ اليومية لتنظيم تدفق المرضى، جدولة الحجوزات بدقة، وتنسيق
            مواعيد العيادات لضمان تقديم خدمة استقبال متميزة وسلسة.
          </p>
        </div>

        {/* قسم الفورم */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-right mb-8">
              <h3 className="text-3xl font-black theme-text-accent">
                تسجيل الدخول
              </h3>
              <p className="theme-text-muted">
                أدخل بياناتك للوصول إلى لوحة التحكم
              </p>
            </div>

            <AuthInput
              label="البريد الإلكتروني"
              type="email"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <AuthInput
              label="كلمة المرور"
              isPassword
              value={password}
              error={errors.password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* زر تذكر الجلسة */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={handleToggleRememberMe}
            >
              <div
                className={`relative w-11 h-6 rounded-full transition-all flex items-center px-1 ${
                  rememberMe ? "theme-accent" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <Motion.div
                  layout
                  className="w-4 h-4 bg-white rounded-full"
                  animate={{ x: rememberMe ? 0 : -20 }}
                />
              </div>
              <span className="text-sm font-bold theme-text-muted">
                تذكر تسجيل دخولي
              </span>
            </div>

            {/* زر تأكيد الدخول مع تفقد حالة التحميل */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري الدخول...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>دخول النظام</span>
                  <LoginIcon fontSize="small" />
                </span>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/reset-password"
                className="inline-flex items-center justify-center text-sm font-bold theme-text-accent hover:opacity-80 transition-opacity"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>

          <div className="mt-5 text-center border-t theme-border pt-6">
            <p className="text-xs theme-text-muted font-bold">
              جميع الحقوق محفوظة لمركز الشفاء الطبي © 2026
            </p>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default LoginPage;
