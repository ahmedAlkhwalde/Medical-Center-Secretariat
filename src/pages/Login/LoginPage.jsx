import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleRememberMe, login } from "../../features/auth/authSlice";
import AuthInput from "./Components/AuthInput";
import { motion as Motion } from "framer-motion";
import LoginIcon from "@mui/icons-material/Login";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // نراقب الـ token والـ rememberMe من الـ Redux
  const { rememberMe, token } = useSelector((state) => state.auth);
  const passwordResetSuccess = location.state?.passwordResetSuccess;

  // --- أفضل مكان للانتقال ---
  // نراقب الـ token؛ بمجرد وجوده، يتم الانتقال تلقائياً
  useEffect(() => {
    if (token) {
      navigate("/main-page");
    }
  }, [token, navigate]);

  const validate = () => {
    let tempErrors = {};
    if (phone.length !== 10)
      tempErrors.phone = "يجب أن يتكون رقم الهاتف من 10 أرقام";
    if (password.length < 8)
      tempErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login({ phone, password }));
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
            مرحباً <br /> بالسكرتاريا
          </Motion.h1>
          <p className="text-lg theme-text-on-accent opacity-80 font-medium">
            نظام متخصص لإدارة أعمال السكرتاريا وتنظيم المواعيد والملفات الطبية
            بكفاءة واحترافية عالية.
          </p>
        </div>

        {/* قسم الفورم */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-right mb-8">
              <h3 className="text-3xl font-black theme-text-accent">
                دخول السكرتاريا
              </h3>
              <p className="theme-text-muted">
                سجّل دخول حسابك لإدارة أعمال المكتب والمرضى
              </p>
            </div>

            {/* {passwordResetSuccess ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-right text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول بالكلمة الجديدة.
              </div>
            ) : null} */}

            <AuthInput
              label="رقم الهاتف"
              type="number"
              value={phone}
              error={errors.phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxx"
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
              className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>دخول النظام</span>
              <LoginIcon fontSize="small" />
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
