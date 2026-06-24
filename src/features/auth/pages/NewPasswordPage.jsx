import { Link } from "react-router-dom";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import AuthInput from "../Components/AuthInput";
import ResetAuthLayout from "../Components/ResetAuthLayout";
import { useNewPasswordForm } from "../hooks/useNewPasswordForm"; // استيراد الـ Controller المخصص

const NewPasswordPage = () => {
  // تفكيك عناصر التحكم الذكية من الهوك
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isPending,
    handleSubmit,
  } = useNewPasswordForm();

  return (
    <ResetAuthLayout
      step={3}
      title="تعيين كلمة المرور الجديدة"
      subtitle="ضع كلمة سر جديدة للحساب ثم أكدها للانتقال مباشرة إلى شاشة تسجيل الدخول."
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
            تغيير كلمة السر
          </h3>
          <p className="theme-text-muted mt-2 leading-7">
            بعد الحفظ سيتم إرجاعك إلى صفحة الدخول مع رسالة نجاح.
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
          disabled={isPending}
        />

        <AuthInput
          label="تأكيد كلمة المرور"
          isPassword
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>جاري حفظ كلمة المرور...</span>
            </>
          ) : (
            <span>حفظ كلمة المرور الجديدة</span>
          )}
        </button>
      </form>
    </ResetAuthLayout>
  );
};

export default NewPasswordPage;