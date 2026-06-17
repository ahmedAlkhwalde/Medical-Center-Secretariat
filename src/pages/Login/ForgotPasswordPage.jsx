import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, MarkEmailUnread } from "@mui/icons-material";
import AuthInput from "./Components/AuthInput";
import ResetAuthLayout from "./Components/ResetAuthLayout";

// استدعاء الهوك الجديد (عدل المسار حسب مكان حفظ الملف السابق)
import { useForgotPasswordMutation } from "../../services/authService"; 

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  // استدعاء الميوتيشن والـ loading مباشرة من ملف الـ API
  const { mutate, isPending } = useForgotPasswordMutation();

  const validate = () => {
    const value = identifier.trim();
    if (!value) {
      setError("أدخل البريد الإلكتروني");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    // تشغيل الـ API وتمرير الإيميل كـ الـ variables للهوك
    mutate(identifier.trim());
  };

  return (
    <ResetAuthLayout
      step={1}
      title="استعادة كلمة المرور"
      subtitle="أدخل البريد الإلكتروني المرتبط بالحساب لنرسل لك رمز التحقق."
      footer={
        <div className="text-center text-sm font-medium theme-text-muted">
          <Link
            to="/"
            className="inline-flex items-center gap-2 theme-text-accent font-bold hover:opacity-80 transition-opacity"
          >
            <ArrowBack fontSize="small" />
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-right mb-2">
          <h3 className="text-3xl font-black theme-text-accent">
            نسيت كلمة المرور
          </h3>
          <p className="theme-text-muted mt-2 leading-7">
            يمكنك استخدام الهاتف أو البريد الإلكتروني للوصول إلى واجهة التحقق.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border theme-border theme-surface p-3 flex items-center gap-3">
            <MarkEmailUnread className="theme-text-accent" />
            <div className="text-right">
              <p className="text-sm font-bold theme-text">البريد الإلكتروني</p>
              <p className="text-xs theme-text-muted">example@mail.com</p>
            </div>
          </div>
        </div>

        <AuthInput
          label="البريد الإلكتروني"
          type="text"
          value={identifier}
          error={error}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="email@example.com"
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              {/* الـ Spinner أثناء عملية التحميل */}
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>جاري الإرسال...</span>
            </>
          ) : (
            <>
              <span>إرسال رمز التحقق</span>
              <ArrowForward fontSize="small" />
            </>
          )}
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default ForgotPasswordPage;