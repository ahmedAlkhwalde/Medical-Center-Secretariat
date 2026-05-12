import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

// استيراد المكونات والصفحات
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/Login/VerifyResetCodePage";
import NewPasswordPage from "./pages/Login/NewPasswordPage";
import { applyThemeMode } from "./app/theme";

// استيراد أدوات Firebase
import { messaging, requestForToken } from "./firebase"; 
import { onMessage } from "firebase/messaging";
import axios from "axios"; // أضف هذا السطر في الأعلى
// لم نعد بحاجة لاستيراد مكونات Snackbar و Alert من MUI

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);

  // حذفنا حالات الـ Snackbar القديمة (openNotification, notification)

  // 1. تطبيق الثيم (Dark/Light)
  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  // 2. إعداد مستمع الإشعارات (Foreground) - النسخة الاحترافية
  // useEffect(() => {
  //   // جلب التوكن عند بداية تشغيل التطبيق
  //   requestForToken();

  //   // الاستماع الدائم للإشعارات في المقدمة
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("✅ وصل إشعار خلف الكواليس:", payload);
      
  //     // السر هنا: نجبر المتصفح على عرض "إشعار نظام حقيقي" (System Notification)
  //     // حتى لو كان الموقع مفتوحاً ونشطاً أمام المستخدم.
      
  //     if (Notification.permission === "granted") {
  //       // إنشاء وإظهار الإشعار المرئي من المتصفح
  //       const notification = new Notification(payload.notification.title, {
  //         body: payload.notification.body,
  //         icon: "/favicon.svg", // تأكد أن هذا الملف موجود في مجلد public
  //         badge: "/favicon.svg", // للأندرويد
  //         vibrate: [200, 100, 200], // نمط الهز للموبايل
  //         requireInteraction: true // يبقى ظاهرًا حتى يتفاعل معه المستخدم
  //       });

  //       // تعريف ماذا يحدث عند الضغط على هذا الإشعار (داخل التطبيق)
  //       notification.onclick = (event) => {
  //         event.preventDefault(); // منع السلوك الافتراضي للمتصفح
  //         window.focus(); // التركيز على نافذة التطبيق
          
  //         // هنا يمكنك إضافة كود للتوجيه لصفحة معينة داخل التطبيق
  //         // مثال: useNavigate('/main-page/appointments');
  //         console.log("تم الضغط على الإشعار من داخل التطبيق مفتوحاً");
  //         notification.close(); // إغلاق الإشعار بعد الضغط
  //       };
  //     }
  //   });

  //   return () => {
  //     if (unsubscribe) unsubscribe(); // تنظيف المستمع عند إغلاق التطبيق
  //   };
  // }, []);
// داخل useEffect في App.jsx

useEffect(() => {
  requestForToken().then((token) => {
    if (token) {
      // إرسال التوكن إلى الباك-إند فور الحصول عليه
      sendTokenToBackend(token);
    }
  });
}, []);


const sendTokenToBackend = async (fcmToken) => {
  try {
    // تأكد من أن الرابط يطابق المسار في ملف api.php في لارافيل
    const response = await axios.post('http://172.19.24.45:8000/api/update-fcm-token', {
      fcm_token: fcmToken,
      user_id: 1 // يمكنك تمرير ID المستخدم الحقيقي هنا
    });
    console.log("✅ تم حفظ التوكن في السيرفر:", response.data);
  } catch (error) {
    console.error("❌ فشل إرسال التوكن للسيرفر:", error.message);
  }
};

  return (
    <div className="App">
      {/* حذفنا مكون الـ Snackbar من هنا */}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/verify"
          element={<VerifyResetCodePage />}
        />
        <Route
          path="/reset-password/new-password"
          element={<NewPasswordPage />}
        />
        <Route path="/main-page/*" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
