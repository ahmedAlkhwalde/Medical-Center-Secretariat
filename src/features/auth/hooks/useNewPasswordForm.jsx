import { useState } from "react";
import { useResetPasswordMutation } from "../service/authService";

export const useNewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // جلب الهوك وحالة التحميل الخاصة بالـ API
  const { mutate, isPending } = useResetPasswordMutation();

  // منطق التحقق والـ Validation (Business Logic)
  const validateForm = () => {
    const nextErrors = {};
    if (password.length < 8) {
      nextErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // معالج إرسال البيانات (Form Submission Handler)
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // جلب المعرّف (الإيميل) المحفوظ في الخطوة الأولى
    const contact = sessionStorage.getItem("reset_identifier") || "";

    // استدعاء الميوتيشن وتمرير البيانات للباك إيند
    mutate({
      contact,
      password,
      password_confirmation: confirmPassword,
    });
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isPending,
    handleSubmit,
  };
};