import { useMutation } from '@tanstack/react-query';

// محاكاة طلب API حقيقي
const loginApi = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.password === "12345678") {
        resolve({ user: "أحمد خالد", token: "jwt_token_123" });
      } else {
        reject(new Error("كلمة المرور غير صحيحة"));
      }
    }, 1500);
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log("تم تسجيل الدخول بنجاح:", data);
    },
  });
};