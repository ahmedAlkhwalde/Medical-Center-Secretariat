import { useState, useEffect, useMemo } from "react";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "../service/authService";

export const useVerifyResetCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);

  const identifier = sessionStorage.getItem("reset_identifier") || "";

  // استدعاء الميوتيشن الخاص بالتحقق وإعادة الإرسال
  const { mutate: verifyMutate, isPending: isVerifying } = useVerifyOtpMutation();
  const { mutate: resendMutate, isPending: isResending } = useForgotPasswordMutation();

  // تأثير الـ Countdown للمؤقت الزمني
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // حجب البريد الإلكتروني أو الهاتف لحماية البيانات
  const maskedIdentifier = useMemo(() => {
    if (!identifier) return "";
    if (identifier.includes("@")) {
      const [user, domain] = identifier.split("@");
      return `${user.slice(0, 2)}***@${domain}`;
    }
    return `${identifier.slice(0, 3)}******${identifier.slice(-2)}`;
  }, [identifier]);

  // الانتقال التلقائي للمربع التالي أثناء الكتابة
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // الرجوع للمربع السابق عند ضغط Backspace
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`reset-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // معالجة لصق الرمز المكون من 6 أرقام وتوزيعه تلقائياً
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const nextCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      nextCode[i] = pastedData[i];
    }
    setCode(nextCode);

    const targetIndex = Math.min(pastedData.length, 5);
    const targetInput = document.getElementById(`reset-code-${targetIndex}`);
    targetInput?.focus();
  };

  // إرسال كود التحقق النهائي للباك إيند
  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode.length < 6) return;

    verifyMutate({ contact: identifier, code: enteredCode });
  };

  // إعادة إرسال الرمز وتصفير المؤقت
  const handleResendCode = () => {
    if (timeLeft > 0 || isResending) return;

    resendMutate(identifier, {
      onSuccess: () => {
        setTimeLeft(60);
      },
    });
  };

  // تصدير واجهة التحكم الكاملة
  return {
    code,
    timeLeft,
    maskedIdentifier,
    isVerifying,
    isResending,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResendCode,
  };
};