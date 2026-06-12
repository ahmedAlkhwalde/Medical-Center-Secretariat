
// // src/App.jsx
// import "./App.css";
// import { useEffect, useRef } from "react"; 
// import { Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";

// import MainPage from "./pages/MainPage";
// import LoginPage from "./pages/Login/LoginPage";
// import { applyThemeMode } from "./app/theme";
// import { messaging, requestForToken } from "./firebase"; 
// import { onMessage } from "firebase/messaging";

// function App() {
//   const darkMode = useSelector((state) => state.ui.darkMode);
//   const isTokenProcessed = useRef(false);

//   useEffect(() => {
//     applyThemeMode(darkMode);
//   }, [darkMode]);

//   const sendTokenToBackend = async (fcmToken) => {
//     try {
//       const response = await axios.post('http://10.113.180.45:8000/api/update-fcm-token', {
//         fcm_token: fcmToken,
//         user_id: 1 
//       });
//       console.log("✅ استجابة السيرفر:", response.data);
//     } catch (error) {
//       console.error("❌ فشل التحديث:", error.message);
//     }
//   };

//   useEffect(() => {
//     // التأكد من أن المعالجة تتم مرة واحدة فقط
//     if (isTokenProcessed.current) return;

//     const setupFCM = async () => {
//       // نتحقق من الصلاحيات قبل طلب التوكن
//       if (Notification.permission === "granted" || Notification.permission === "default") {
//         const token = await requestForToken();
//         if (token && !isTokenProcessed.current) {
//           await sendTokenToBackend(token);
//           isTokenProcessed.current = true;
//         }
//       }
//     };

//     setupFCM();

//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("🔔 تم استلام البيانات في المقدمة:", payload);
//       // ملاحظة: لا تضع كود عرض إشعار هنا لمنع التكرار مع الـ Service Worker
//     });

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, []);

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/main-page/*" element={<MainPage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;





import "./App.css";
import React, { useEffect, useRef } from "react"; 
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/Login/LoginPage";
import { applyThemeMode } from "./app/theme";
import notificationService from "./app/services/notificationChatService"; // 💡 استدعاء السيرفس الموحد الخاص بك

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const isTokenProcessed = useRef(false);

  // 1. تطبيق الوضع الليلي / العادي عند تغيره في الـ Redux
  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  // 2. إدارة منطق إشعارات الفايربيس (FCM) من خلال السيرفس المدمج
  useEffect(() => {
    // 🔔 تشغيل إعداد الفايربيس، جلب التوكن، وتحديثه في السيرفر تلقائياً
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
        <Route path="/" element={<LoginPage />} />
        <Route path="/main-page/*" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;