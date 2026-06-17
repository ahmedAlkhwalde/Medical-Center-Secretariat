import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, Verified, Refresh } from "@mui/icons-material";
import ResetAuthLayout from "./Components/ResetAuthLayout";

// استدعاء الهوكات المخصصة من ملف الـ API
import { useVerifyOtpMutation, useForgotPasswordMutation } from "../../services/authService"; 

const VerifyResetCodePage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // مؤقت الـ 60 ثانية يبدأ فوراً
  
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

  const maskedIdentifier = useMemo(() => {
    if (!identifier) return "";
    if (identifier.includes("@")) {
      const [user, domain] = identifier.split("@");
      return `${user.slice(0, 2)}***@${domain}`;
    }
    return `${identifier.slice(0, 3)}******${identifier.slice(-2)}`;
  }, [identifier]);

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

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`reset-code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // إرسال كود التحقق للباك إيند
  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredCode = code.join("");
    
    if (enteredCode.length < 6) return;

    // استدعاء الهوك وتمرير البيانات المطلوبة بالـ Body
    verifyMutate({ contact: identifier, code: enteredCode });
  };

  // دالة التعامل مع إعادة إرسال الرمز
  const handleResendCode = () => {
    if (timeLeft > 0 || isResending) return;

    // استدعاء هوك إعادة الإرسال وتصفير المؤقت عند النجاح
    resendMutate(identifier, {
      onSuccess: () => {
        setTimeLeft(60); // إعادة تشغيل مؤقت الـ 60 ثانية
      }
    });
  };

  return (
    <ResetAuthLayout
      step={2}
      title="التحقق من الرمز"
      subtitle="أدخل رمز التحقق المرسل إلى رقم الهاتف أو البريد الإلكتروني لإكمال الاستعادة."
      footer={
        <div className="flex items-center justify-between gap-3 text-sm font-medium theme-text-muted">
          <Link
            to="/reset-password"
            className="inline-flex items-center gap-2 theme-text-accent font-bold hover:opacity-80 transition-opacity"
          >
            <ArrowBack fontSize="small" />
            الرجوع
          </Link>
          <span>
            {maskedIdentifier
              ? `تم الإرسال إلى ${maskedIdentifier}`
              : "الرمز جاهز للتحقق"}
          </span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-right mb-2">
          <h3 className="text-3xl font-black theme-text-accent">رمز التحقق</h3>
        </div>

        <div className="rounded-2xl border theme-border theme-surface p-4 flex items-center gap-3">
          <Verified className="theme-text-accent" />
          <div className="text-right">
            <p className="text-sm font-bold theme-text">تم إرسال الرمز</p>
            <p className="text-xs theme-text-muted">
              أدخله من اليمين لليسار أو بأي ترتيب ثم اضغط تأكيد.
            </p>
          </div>
        </div>

        {/* حقول الـ OTP */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`reset-code-${index}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isVerifying}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-14 rounded-2xl border theme-border theme-primary text-center text-xl font-black theme-text outline-none transition-all focus:border-(--color-accent) focus:shadow-[0_10px_25px_-5px_var(--color-shadow-accent)] disabled:opacity-60"
            />
          ))}
        </div>

        {/* قسم زر إعادة إرسال الرمز والمؤقت */}
        <div className="text-center text-sm font-medium theme-text-muted pt-2">
          {timeLeft > 0 ? (
            <p>
              يمكنك إعادة إرسال الرمز بعد{" "}
              <span className="theme-text-accent font-bold">{timeLeft} ثانية</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="inline-flex items-center gap-1 theme-text-accent font-bold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {isResending ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
              ) : (
                <Refresh fontSize="small" />
              )}
              لم يصلك الرمز؟ إعادة إرسال
            </button>
          )}
        </div>

        {/* زر التأكيد الرئيسي */}
        <button
          type="submit"
          disabled={isVerifying || code.join("").length < 6}
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <>
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>جاري التحقق...</span>
            </>
          ) : (
            <>
              <span>تأكيد الرمز</span>
              <ArrowForward fontSize="small" />
            </>
          )}
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default VerifyResetCodePage;