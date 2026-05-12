import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDC_PG6WCHGZpxFlQTRnysaivEI_szYslg",
  authDomain: "doctor-app-syria-2026.firebaseapp.com",
  projectId: "doctor-app-syria-2026",
  storageBucket: "doctor-app-syria-2026.firebasestorage.app",
  messagingSenderId: "944253436216",
  appId: "1:944253436216:web:81cdb24637f0426a1b01cd"
};

// تهيئة Firebase مرة واحدة فقط
const app = initializeApp(firebaseConfig);

// تعريف خدمة الرسائل مرة واحدة فقط
export const messaging = getMessaging(app);

// دالة طلب التوكن
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BOEPAyLu2aTAFd11s10SqIaZrxH4Trja5BXy9srigPG6B6_G3rLnVQ11jIB7QnhZBo0EQimotSVhDBevd8sb-r0"
    });

    if (currentToken) {
      console.log("✅ Web Token الحجز جاهز:", currentToken);
      return currentToken;
    } else {
      console.log("⚠️ لم يتم منح صلاحية الإشعارات.");
    }
  } catch (err) {
    console.log("❌ خطأ أثناء جلب التوكن:", err);
  }
};

// دالة الاستماع للرسائل والتطبيق مفتوح
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;