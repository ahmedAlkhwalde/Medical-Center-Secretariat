import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack, ArrowForward, Verified } from "@mui/icons-material";
import ResetAuthLayout from "./Components/ResetAuthLayout";

const VerifyResetCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const identifier = sessionStorage.getItem("reset_identifier") || "";
  const expectedCode = sessionStorage.getItem("reset_code") || "123456";

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode !== expectedCode) {
      return;
    }
    navigate("/reset-password/new-password");
  };

  return (
    <ResetAuthLayout
      step={2}
      title="التحقق من هوية الموظف"
      subtitle="أدخل رمز التحقق الذي تم إرساله إلى بيانات حسابك للمتابعة بأمان."
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
          <h3 className="text-3xl font-black theme-text-accent">
            رمز التحقق الأمني
          </h3>
          <p className="theme-text-muted mt-2 leading-7">
            استخدم الرمز المرسل إلى بيانات حسابك. في الواجهة التجريبية استخدم{" "}
            <span className="font-bold theme-text">123456</span>.
          </p>
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

        <div className="grid grid-cols-6 gap-2 sm:gap-3" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`reset-code-${index}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-14 rounded-2xl border theme-border theme-primary text-center text-xl font-black theme-text outline-none transition-all focus:border-(--color-accent) focus:shadow-[0_10px_25px_-5px_var(--color-shadow-accent)]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span>تأكيد الرمز</span>
          <ArrowForward fontSize="small" />
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default VerifyResetCodePage;
