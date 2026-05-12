import { motion as Motion } from "framer-motion";

const ResetAuthLayout = ({ title, subtitle, step, children, footer }) => {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex items-center justify-center theme-bg p-4 overflow-hidden"
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-250 theme-surface rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row border theme-border overflow-hidden"
      >
        <div className="hidden md:flex md:w-1/2 theme-accent p-12 flex-col justify-between relative">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold theme-text-on-accent">
              الخطوة {step}
            </div>
            <Motion.h1
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-4xl xl:text-5xl font-black theme-text-on-accent leading-tight"
            >
              {title}
            </Motion.h1>
            <p className="text-base xl:text-lg theme-text-on-accent opacity-85 font-medium leading-8">
              {subtitle}
            </p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-4 text-sm theme-text-on-accent/90 leading-7">
            هذا المسار مستقل عن تسجيل الدخول ويستخدم لتحديث كلمة المرور خطوة
            بخطوة.
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {children}
          {footer ? <div className="mt-5">{footer}</div> : null}
        </div>
      </Motion.div>
    </div>
  );
};

export default ResetAuthLayout;
