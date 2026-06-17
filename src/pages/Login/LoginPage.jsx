import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleRememberMe,
  setCredentials,
} from "../../features/auth/authSlice";
import { showSnackbar, hideSnackbar } from "../../features/uiSlice";
import AuthInput from "./Components/AuthInput";
import { motion as Motion } from "framer-motion";
import LoginIcon from "@mui/icons-material/Login";
import { useLoginMutation } from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  // نراقب الـ token والـ rememberMe من الـ Redux
  const { rememberMe, token, lastUsedEmail } = useSelector(
    (state) => state.auth,
  );

  // --- أفضل مكان للانتقال ---
  // نراقب الـ token؛ بمجرد وجوده، يتم الانتقال تلقائياً
  useEffect(() => {
    if (!token) return;
    if (!pendingRedirect) {
      navigate("/main-page");
      return;
    }
    const timer = setTimeout(() => {
      navigate("/main-page");
    }, 700);
    return () => clearTimeout(timer);
  }, [token, pendingRedirect, navigate]);

  useEffect(() => {
    if (lastUsedEmail) {
      // setEmail(lastUsedEmail);
    }
  }, [lastUsedEmail]);

  const validate = () => {
    const tempErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }
    if (password.length < 8) {
      tempErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(hideSnackbar());
    setErrors({});
    if (validate()) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            if (!data?.token) {
              dispatch(
                showSnackbar({
                  message: "تعذر تسجيل الدخول. الرجاء المحاولة لاحقاً.",
                  variant: "error",
                }),
              );
              return;
            }

            dispatch(
              setCredentials({
                token: data.token,
                user: data.user ?? null,
                rememberMe,
                lastUsedEmail: email,
              }),
            );
            
            console.log(data.user);
            dispatch(
              showSnackbar({
                message: "تم تسجيل الدخول بنجاح",
                variant: "success",
              }),
            );
            setPendingRedirect(true);
          },
          onError: (error) => {
            dispatch(
              showSnackbar({
                message: "تعذر تسجيل الدخول. تحقق من البيانات.",
                variant: "error",
              }),
            );
          },
        },
      );
    }
  };

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
            منصتكِ اليومية لتنظيم تدفق المرضى، جدولة الحجوزات بدقة، وتنسيق مواعيد العيادات لضمان تقديم خدمة استقبال متميزة وسلسة.
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

            {/* {passwordResetSuccess ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-right text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول بالكلمة الجديدة.
              </div>
            ) : null} */}

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

            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => dispatch(toggleRememberMe())}
            >
              <div
                className={`relative w-11 h-6 rounded-full transition-all flex items-center px-1 ${rememberMe ? "theme-accent" : "bg-gray-300 dark:bg-gray-700"}`}
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

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loginMutation.isPending ? (
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
