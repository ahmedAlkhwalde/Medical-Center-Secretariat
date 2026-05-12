import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import AuthInput from "./Components/AuthInput";
import ResetAuthLayout from "./Components/ResetAuthLayout";

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    sessionStorage.removeItem("reset_identifier");
    sessionStorage.removeItem("reset_code");
    navigate("/", { state: { passwordResetSuccess: true } });
  };

  return (
    <ResetAuthLayout
      step={3}
      title="تعيين كلمة مرور جديدة للسكرتاريا"
      subtitle="أنشئ كلمة سر جديدة وآمنة لحسابك ثم انقر حفظ للعودة إلى الدخول."
      footer={
        <div className="text-center text-sm font-medium theme-text-muted">
          <Link
            to="/reset-password/verify"
            className="inline-flex items-center gap-2 theme-text-accent font-bold hover:opacity-80 transition-opacity"
          >
            <ArrowBack fontSize="small" />
            العودة إلى التحقق
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-right mb-2">
          <h3 className="text-3xl font-black theme-text-accent">
            كلمة سر جديدة آمنة
          </h3>
          <p className="theme-text-muted mt-2 leading-7">
            أدخل كلمة سر قوية وجديدة. ستعود مباشرة لتسجيل دخول السكرتاريا.
          </p>
        </div>

        <div className="rounded-2xl border theme-border theme-surface p-4 flex items-center gap-3">
          <CheckCircle className="theme-text-accent" />
          <div className="text-right">
            <p className="text-sm font-bold theme-text">تم التحقق من الهوية</p>
            <p className="text-xs theme-text-muted">
              الآن يمكنك وضع كلمة مرور جديدة وآمنة.
            </p>
          </div>
        </div>

        <AuthInput
          label="كلمة المرور الجديدة"
          isPassword
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <AuthInput
          label="تأكيد كلمة المرور"
          isPassword
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity"
        >
          حفظ كلمة المرور الجديدة
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default NewPasswordPage;
