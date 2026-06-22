// import axios from 'axios';

// const AUTH_STORAGE_KEY = "secretarai_auth";

// // دالة قراءة التوكن من الـ Storage (شغل الـ main)
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

// export var host_chat = 'http://127.0.0.1:8000';

// const apiClient = axios.create({
//   baseURL: `http://127.0.0.1:8000/api`, 
//   timeout: 60000,
//   headers: {
//     'Accept': 'application/json',
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const storedToken = readStoredToken();

//     if (storedToken) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${storedToken}`;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default apiClient;

import axios from 'axios';

const AUTH_STORAGE_KEY = "secretarai_auth";

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

export var host_chat = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: `http://127.0.0.1:8000/api`, 
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
  },
});

// 1️⃣ مُعترض الطلبات (Request Interceptor) - كما هو في كودك المصدري
apiClient.interceptors.request.use(
  (config) => {
    const storedToken = readStoredToken();

    if (storedToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

// 2️⃣ 👇 تم إضافة مُعترض الاستجابات (Response Interceptor) للتعامل مع الـ 401 فوراً
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (window.location.pathname === '/') {
        return Promise.reject(error);
      }
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear auth storage:", e);
      }
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;