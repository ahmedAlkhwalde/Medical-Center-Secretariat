
// استيراد مكتبات فيربيس الخاصة بالـ Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDC_PG6WCHGZpxFlQTRnysaivEI_szYslg",
  authDomain: "doctor-app-syria-2026.firebaseapp.com",
  projectId: "doctor-app-syria-2026",
  storageBucket: "doctor-app-syria-2026.firebasestorage.app",
  messagingSenderId: "944253436216",
  appId: "1:944253436216:web:81cdb24637f0426a1b01cd"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg', 
    badge: '/favicon.svg',
    // التعديل الجوهري: استخدام tag ثابت لمنع تكرار الإشعارات المتطابقة
    tag: 'appointment-notification-group', 
    renotify: false, 
    requireInteraction: true, 
    data: {
        url: '/main-page/appointments'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = '/main-page/appointments'; 

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});