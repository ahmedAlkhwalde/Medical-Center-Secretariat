import { useMutation } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../features/uiSlice";
import { useNavigate } from "react-router-dom";

export const loginUser = async (payload) => {
  const response = await apiClient.post("/secretary/login", payload);
  const data = response.data;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data;
};

export const logoutUser = async (token) => {
  const response = await apiClient.post(
    "/secretary/logout",
    null,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  );
  return response.data;
};

export const useLoginMutation = (options = {}) =>
  useMutation({
    mutationFn: loginUser,
    ...options,
  });

export const useLogoutMutation = (options = {}) =>
  useMutation({
    mutationFn: logoutUser,
    ...options,
  });



const forgotPasswordService = async (email) => {
  const response = await apiClient.post("/secretary/forgot-password", { email });
  return response.data;
};


export const useForgotPasswordMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPasswordService,
    onSuccess: (data, email) => {
      sessionStorage.setItem("reset_identifier", email);
      
      dispatch(
        showSnackbar({
          message: data?.message || "تم إرسال رمز التحقق بنجاح",
          variant: "success",
        })
      );      
      navigate("/reset-password/verify");
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || "حدث خطأ ما، يرجى المحاولة لاحقاً";
      
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};




const verifyOtpService = async ({ contact, code }) => {
  const response = await apiClient.post("/secretary/verify-otp", { contact, code });
  return response.data;
};


export const useVerifyOtpMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOtpService,
    onSuccess: (data) => {
      dispatch(
        showSnackbar({
          message: data?.message || "تم التحقق من الرمز بنجاح",
          variant: "success",
        })
      );
      // الانتقال لصفحة تعيين كلمة المرور الجديدة
      navigate("/reset-password/new-password");
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || "الرمز المدخل غير صحيح";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};



// أضف هذه الأكواد إلى ملف authApi.js الخاص بك

// دالة الـ API لتعيين كلمة المرور الجديدة
const resetPasswordService = async ({ contact, password, password_confirmation }) => {
  const response = await apiClient.put("/secretary/reset-password", {
    contact,
    password,
    password_confirmation,
  });
  return response.data;
};

// الهوك المخصص لتعيين كلمة المرور الجديدة
export const useResetPasswordMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordService,
    onSuccess: (data) => {
      // تنظيف البيانات المؤقتة من المتصفح بعد النجاح
      sessionStorage.removeItem("reset_identifier");
      sessionStorage.removeItem("reset_code");

      dispatch(
        showSnackbar({
          message: data?.message || "تم إعادة تعيين كلمة المرور بنجاح.",
          variant: "success",
        })
      );

      // التوجيه إلى صفحة تسجيل الدخول الرئيسية
      navigate("/", { state: { passwordResetSuccess: true } });
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || "حدث خطأ أثناء حفظ كلمة المرور الجديدة";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};