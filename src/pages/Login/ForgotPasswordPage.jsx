import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  ArrowBack,
  ArrowForward,
  MarkEmailUnread,
  PhoneAndroid,
} from "@mui/icons-material";
import AuthInput from "./Components/AuthInput";
import ResetAuthLayout from "./Components/ResetAuthLayout";

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const value = identifier.trim();
    if (!value) {
      setError("أدخل رقم الهاتف أو البريد الإلكتروني");
      return false;
    }
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phonePattern.test(value) && !emailPattern.test(value)) {
      setError("الرجاء إدخال رقم هاتف صحيح من 10 أرقام أو بريد إلكتروني صحيح");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    sessionStorage.setItem("reset_identifier", identifier.trim());
    sessionStorage.setItem("reset_code", "123456");
    navigate("/reset-password/verify");
  };

  return (
    <ResetAuthLayout
      step={1}
      title="استعادة وصول السكرتاريا"
      subtitle="أدخل بيانات حسابك لاستعادة الوصول إلى نظام إدارة السكرتاريا بشكل آمن."
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
            استرجاع دخول الموظف
          </h3>
          <p className="theme-text-muted mt-2 leading-7">
            استخدم رقم الهاتف أو البريد المسجل لديك للتحقق واستعادة الوصول.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border theme-border theme-surface p-3 flex items-center gap-3">
            <PhoneAndroid className="theme-text-accent" />
            <div className="text-right">
              <p className="text-sm font-bold theme-text">رقم الهاتف</p>
              <p className="text-xs theme-text-muted">مثال: 09xxxxxxxx</p>
            </div>
          </div>
          <div className="rounded-2xl border theme-border theme-surface p-3 flex items-center gap-3">
            <MarkEmailUnread className="theme-text-accent" />
            <div className="text-right">
              <p className="text-sm font-bold theme-text">البريد الإلكتروني</p>
              <p className="text-xs theme-text-muted">example@mail.com</p>
            </div>
          </div>
        </div>

        <AuthInput
          label="رقم الهاتف أو البريد الإلكتروني"
          type="text"
          value={identifier}
          error={error}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="09xxxxxxxx أو email@example.com"
        />

        <button
          type="submit"
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span>إرسال رمز التحقق</span>
          <ArrowForward fontSize="small" />
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default ForgotPasswordPage;
