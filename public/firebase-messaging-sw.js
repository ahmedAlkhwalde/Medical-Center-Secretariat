// استيراد مكتبات فيربيس الخاصة بالـ Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// نفس الإعدادات التي استخدمناها في كودك السابق
const firebaseConfig = {
  apiKey: "AIzaSyDC_PG6WCHGZpxFlQTRnysaivEI_szYslg",
  authDomain: "doctor-app-syria-2026.firebaseapp.com",
  projectId: "doctor-app-syria-2026",
  storageBucket: "doctor-app-syria-2026.firebasestorage.app",
  messagingSenderId: "944253436216",
  appId: "1:944253436216:web:81cdb24637f0426a1b01cd"
};

// تهيئة فيربيس
firebase.initializeApp(firebaseConfig);

// تعريف خدمة الرسائل
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg', // تأكد من وضع أيقونة عيادتك هنا لتبدو رسالة نظام حقيقية
    badge: '/favicon.svg',
    tag: 'appointment-notification', // لمنع تكرار الإشعارات
    renotify: true,
    requireInteraction: true, // لكي لا يختفي الإشعار إلا إذا ضغطت عليه (مثل فلاتر)
    data: {
        url: '/main-page/appointments' // الرابط الذي سيفتح عند الضغط
    }
  };

  // هذا هو السطر السحري الذي يظهر "رسالة النظام الحقيقية"
  return self.registration.showNotification(notificationTitle, notificationOptions);
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // إغلاق الإشعار بعد الضغط

  // الرابط الذي تريد فتحه (مثلاً صفحة المواعيد)
  const urlToOpen = '/main-page/appointments'; 

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // إذا كان الموقع مفتوحاً أصلاً، قم بالتركيز عليه (Focus)
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا لم يكن مفتوحاً، افتحه في نافذة جديدة
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});