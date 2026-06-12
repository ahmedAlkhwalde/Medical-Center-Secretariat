// import axios from 'axios';

// const AUTH_STORAGE_KEY = "manegar_auth";

// const readStoredToken = () => {
//   const readFromStorage = (storage) => {
//     const raw = storage.getItem(AUTH_STORAGE_KEY);
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     return parsed?.token ?? null;
//   };

//   try {
//     return readFromStorage(localStorage) || readFromStorage(sessionStorage);
//   } catch {
//     return null;
//   }
// };

// // 1. إنشاء نسخة مخصصة من Axios بإعدادات ثابتة
// const apiClient = axios.create({
//   baseURL: 'http://10.113.180.45:8000/api', 
  
//   // timeout: 60000, 
  
//   headers: {
//     // 'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = "24|miQPV1UTDvk6TFDLJxv5X4mgdjIwYRkNs8BEbs8He4523580";
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${"token"}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default apiClient;







import axios from 'axios';

const AUTH_STORAGE_KEY = "manegar_auth";

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

export var host_chat='http://10.113.180.45:8000';
const apiClient = axios.create({
  baseURL: 'http://10.113.180.45:8000/api', 
  headers: {
    'Accept': 'application/json',
  },
});

// الـ Interceptor المعدل للاختبار بـ Hardcoded Token بشكل صحيح
apiClient.interceptors.request.use(
  (config) => {
    // 🎯 التوكن الخاص بك للاختبار
    const myTestToken = "24|miQPV1UTDvk6TFDLJxv5X4mgdjIwYRkNs8BEbs8He4523580";
    
    if (myTestToken) {
      config.headers = config.headers || {};
      // 💡 تمرير اسم المتغير مباشرة دون علامات تنصيص لتتم قراءته ديناميكياً
      config.headers.Authorization = `Bearer ${myTestToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;