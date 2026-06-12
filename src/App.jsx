import "./App.css";
import React, { useEffect, useRef } from "react"; 
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/Login/VerifyResetCodePage";
import NewPasswordPage from "./pages/Login/NewPasswordPage";

import { applyThemeMode } from "./app/theme";
import notificationService from "./app/services/notificationChatService"; // 💡 سيرفس الإشعارات الخاص بك
import AppSnackbar from "./components/AppSnackbar";
import { hideSnackbar } from "./features/uiSlice";

function App() {
  // تجميع الـ Hooks والحالة من الطرفين
  const darkMode = useSelector((state) => state.ui.darkMode);
  const token = useSelector((state) => state.auth.token);
  const snackbar = useSelector((state) => state.ui.snackbar);
  const dispatch = useDispatch();
  
  const isAuthed = Boolean(token);
  const isTokenProcessed = useRef(false); // 💡 ريف الإشعارات الخاص بك

  // 1. تطبيق الوضع الليلي / العادي عند تغيره في الـ Redux
  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  // 2. إدارة منطق إشعارات الفايربيس (FCM) من خلال السيرفس المدمج (شغلك)
  useEffect(() => {
    notificationService.initializeFCM(isTokenProcessed);

    // 📩 بدء الاستماع للإشعارات والرسائل القادمة والتطبيق مفتوح (Foreground)
    const unsubscribe = notificationService.listenToForegroundMessages();

    // تنظيف المستمع عند مغادرة المكون لمنع تكرار العمليات ومشاكل الذاكرة
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* صفحة تسجيل الدخول المحمية */}
        <Route
          path="/"
          element={
            isAuthed ? <Navigate to="/main-page" replace /> : <LoginPage />
          }
        />
        
        {/* صفحات استعادة كلمة المرور الثلاثة */}
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/verify"
          element={<VerifyResetCodePage />}
        />
        <Route
          path="/reset-password/new-password"
          element={<NewPasswordPage />}
        />
        
        {/* لوحة التحكم الرئيسية المحمية بحالة تسجيل الدخول */}
        <Route
          path="/main-page/*"
          element={isAuthed ? <MainPage /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* مكون التنبيهات العام السفلي */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        duration={snackbar.duration}
        onClose={() => dispatch(hideSnackbar())}
      />
    </div>
  );
}

export default App;