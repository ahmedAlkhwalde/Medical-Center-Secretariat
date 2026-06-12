import axios from 'axios';

const AUTH_STORAGE_KEY = "manegar_auth";

// دالة قراءة التوكن من الـ Storage (شغل الـ main)
const readStoredToken = () => {
  const readFromStorage = (storage) => {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  };

  try {
    return readFromStorage(localStorage) || readFromStorage(sessionStorage);
  } catch {
    return null;
  }
};

// 💡 تصدير الهوست الخاص بالمحادثات (شغل الـ chat)
export var host_chat = 'http://127.0.0.1:8000';

// 1. إنشاء نسخة مخصصة من Axios بإعدادات ثابتة ومدمجة
const apiClient = axios.create({
  // تم اعتماد آيبي الشبكة الخاص بالـ chat لضمان اتصال المحادثات والسيرفر معاً
  baseURL: `http://127.0.0.1:8000/api`, 
  timeout: 60000, // مضاف من فرع main لضمان عدم تعليق الطلبات الإدارية
  headers: {
    'Accept': 'application/json',
  },
});

// الـ Interceptor المدمج ليدعم الحالتين (الاختبار والإنتاج)
apiClient.interceptors.request.use(
  (config) => {
    // 1. محاولة جلب التوكن الديناميكي من التخزين (شغل الـ main)
    const storedToken = readStoredToken();
    
    // 2. توكن الاختبار الثابت الخاص بك (شغل الـ chat)
    // const myTestToken = "24|miQPV1UTDvk6TFDLJxv5X4mgdjIwYRkNs8BEbs8He4523580";
    
    // 🎯 الدمج الذكي: إذا وجد توكن مخزن بالـ Storage يستعمله، وإلا يسقط تلقائياً على توكن الاختبار
    const activeToken = storedToken;

    if (activeToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;