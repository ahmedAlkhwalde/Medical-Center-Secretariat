import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rememberMe: true,
  lastUsedPhone: '',
  token: null, // سنستخدم هذا لمعرفة هل المستخدم سجل دخوله أم لا
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // تبديل خاصية تذكرني
    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    // تنفيذ الدخول (منطق مؤقت للواجهة)
    login: (state, action) => {
      const { phone } = action.payload;
      state.token = "dummy-session-token"; // توكن وهمي لتفعيل الانتقال
      state.lastUsedPhone = phone;
      state.user = { name: "Ahmed" };
    },
    // تسجيل الخروج
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  },
});

export const { toggleRememberMe, login, logout } = authSlice.actions;
export default authSlice.reducer;