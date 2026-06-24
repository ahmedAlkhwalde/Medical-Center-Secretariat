import { useState } from "react";
import { useForgotPasswordMutation } from "../service/authService";

export const useForgotPasswordForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  // استدعاء الميوتيشن من السيرفس
  const { mutate, isPending } = useForgotPasswordMutation();

  // منطق التحقق (Business Logic)
  const validateForm = () => {
    const value = identifier.trim();
    if (!value) {
      setError("أدخل البريد الإلكتروني");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      return false;
    }
    setError("");
    return true;
  };

  // معالج إرسال الفورم
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // تمرير البيانات وتجهيز دوال النجاح والفشل لإضافة التوجيه لاحقاً إذا لزم الأمر
    mutate(identifier.trim());
  };

  // تصدير الأدوات الجاهزة للـ View
  return {
    identifier,
    setIdentifier,
    error,
    isPending,
    handleSubmit,
  };
};