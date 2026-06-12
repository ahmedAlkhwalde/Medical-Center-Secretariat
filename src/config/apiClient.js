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

// 1. إنشاء نسخة مخصصة من Axios بإعدادات ثابتة
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  
  timeout: 60000, 
  
  headers: {
    // 'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = readStoredToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;