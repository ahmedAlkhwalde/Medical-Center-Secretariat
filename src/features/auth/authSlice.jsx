import { createSlice, current } from "@reduxjs/toolkit";

const STORAGE_KEY = "secretarai_auth";

const readStoredAuth = () => {
  const readFromStorage = (storage) => {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed;
  };

  try {
    return readFromStorage(localStorage) || readFromStorage(sessionStorage);
  } catch {
    return null;
  }
};

const writeStoredAuth = (data, rememberMe) => {
  try {
    const target = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;
    target.setItem(STORAGE_KEY, JSON.stringify(data));
    other.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

const storedAuth = readStoredAuth();

const initialState = {
  rememberMe: storedAuth?.rememberMe ?? true,
  lastUsedEmail: storedAuth?.lastUsedEmail ?? "",
  token: storedAuth?.token ?? null,
  user: storedAuth?.user ?? null,
  name: storedAuth?.name ?? storedAuth?.user?.name ?? "",
  image: storedAuth?.image ?? storedAuth?.user?.image ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // تبديل خاصية تذكرني
    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    setCredentials: (state, action) => {
      const { token, user, rememberMe, lastUsedEmail } = action.payload;

      if (typeof rememberMe === "boolean") {
        state.rememberMe = rememberMe;
      }

      if (lastUsedEmail) {
        state.lastUsedEmail = lastUsedEmail;
      }

      state.token = token;
      state.user = user ?? null;

      state.name = action.payload.name || user?.name || "";
      state.image = action.payload.image || user?.image || null;

      writeStoredAuth(
        {
          token: state.token,
          user: state.user,
          name: state.name,
          image: state.image,
          rememberMe: state.rememberMe,
          lastUsedEmail: state.lastUsedEmail,
        },
        state.rememberMe,
      );

    },

    updateProfileData: (state, action) => {
      const { name, image } = action.payload;

      // 1. تحديث الاسم والصورة فقط داخل الـ State والمستند الداخلي user
      if (name !== undefined) {
        state.name = name;
        if (state.user) state.user.name = name;
      }

      if (image !== undefined) {
        state.image = image;
        if (state.user) state.user.image = image;
      }

      // 2. الحل الأضمن: أخذ نسخة صافية كاملة من الـ State الحالي
      // لضمان الحفاظ على الـ token وباقي بيانات الـ user (الإيميل، التاريخ، إلخ) دون أي تغيير
      const cleanState = current(state);


      // 3. حفظ البيانات في الـ Storage مع الإبقاء على كل شيء آخر كما هو تماماً
      writeStoredAuth(
        {
          token: cleanState.token,
          user: cleanState.user, // هنا كائن الـ user يحتفظ ببياناته الأخرى بالكامل (email, uuid, active...)
          name: cleanState.name,
          image: cleanState.image,
          rememberMe: cleanState.rememberMe,
          lastUsedEmail: cleanState.lastUsedEmail,
        },
        cleanState.rememberMe,
      );
    },

    // تسجيل الخروج وتنظيف الـ State بالكامل
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.name = "";
      state.image = null;
      clearStoredAuth();
    },
  },
});

// تصدير التابع الجديد هنا
export const { toggleRememberMe, setCredentials, updateProfileData, logout } =
  authSlice.actions;
export default authSlice.reducer;
