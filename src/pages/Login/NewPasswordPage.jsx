// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { ArrowBack, CheckCircle } from "@mui/icons-material";
// import AuthInput from "./Components/AuthInput";
// import ResetAuthLayout from "./Components/ResetAuthLayout";

// const NewPasswordPage = () => {
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const nextErrors = {};
//     if (password.length < 8) {
//       nextErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
//     }
//     if (confirmPassword !== password) {
//       nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
//     }
//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (!validate()) return;

//     sessionStorage.removeItem("reset_identifier");
//     sessionStorage.removeItem("reset_code");
//     navigate("/", { state: { passwordResetSuccess: true } });
//   };

//   return (
//     <ResetAuthLayout
//       step={3}
//       title="تعيين كلمة المرور الجديدة"
//       subtitle="ضع كلمة سر جديدة للحساب ثم أكدها للانتقال مباشرة إلى شاشة تسجيل الدخول."
//       footer={
//         <div className="text-center text-sm font-medium theme-text-muted">
//           <Link
//             to="/reset-password/verify"
//             className="inline-flex items-center gap-2 theme-text-accent font-bold hover:opacity-80 transition-opacity"
//           >
//             <ArrowBack fontSize="small" />
//             العودة إلى التحقق
//           </Link>
//         </div>
//       }
//     >
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="text-right mb-2">
//           <h3 className="text-3xl font-black theme-text-accent">
//             تغيير كلمة السر
//           </h3>
//           <p className="theme-text-muted mt-2 leading-7">
//             بعد الحفظ سيتم إرجاعك إلى صفحة الدخول مع رسالة نجاح.
//           </p>
//         </div>

//         <div className="rounded-2xl border theme-border theme-surface p-4 flex items-center gap-3">
//           <CheckCircle className="theme-text-accent" />
//           <div className="text-right">
//             <p className="text-sm font-bold theme-text">تم التحقق من الهوية</p>
//             <p className="text-xs theme-text-muted">
//               الآن يمكنك وضع كلمة مرور جديدة وآمنة.
//             </p>
//           </div>
//         </div>

//         <AuthInput
//           label="كلمة المرور الجديدة"
//           isPassword
//           value={password}
//           error={errors.password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="••••••••"
//         />

//         <AuthInput
//           label="تأكيد كلمة المرور"
//           isPassword
//           value={confirmPassword}
//           error={errors.confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           placeholder="••••••••"
//         />

//         <button
//           type="submit"
//           className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity"
//         >
//           حفظ كلمة المرور الجديدة
//         </button>
//       </form>
//     </ResetAuthLayout>
//   );
// };

// export default NewPasswordPage;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import AuthInput from "./Components/AuthInput";
import ResetAuthLayout from "./Components/ResetAuthLayout";

// استدعاء الهوك المخصص (عدل المسار حسب مكان ملف الـ API عندك)
import { useResetPasswordMutation } from "../../services/authService";

const NewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // جلب الهوك وحالة التحميل الخاصة بالـ API
  const { mutate, isPending } = useResetPasswordMutation();

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

    // جلب المعرّف (الإيميل) الذي قمنا بحفظه في الخطوة الأولى
    const contact = sessionStorage.getItem("reset_identifier") || "";

    // استدعاء الميوتيشن وتمرير البيانات للباك إيند بنفس بنية الـ Body المطلوبة
    mutate({
      contact,
      password,
      password_confirmation: confirmPassword,
    });
  };

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
          disabled={isPending} // تعطيل الحقل أثناء الإرسال
        />

        <AuthInput
          label="تأكيد كلمة المرور"
          isPassword
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isPending} // تعطيل الحقل أثناء الإرسال
        />

        <button
          type="submit"
          disabled={isPending} // تعطيل الزر لمنع الإرسال المتكرر
          className="w-full py-4 theme-accent theme-text-on-accent rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              {/* Spinner مخصص لعملية الـ Loading */}
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