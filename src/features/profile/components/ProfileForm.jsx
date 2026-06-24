import {
  Person,
  Mail,
  Phone,
  Cake,
  Wc,
  AlternateEmail,
  Lock,
  Save,
} from "@mui/icons-material";
import InputField from "./InputField";

const ProfileForm = ({
  form,
  isEditing,
  isSaving, // ✅ استبدلنا isLoading بـ isSaving
  onChange,
  onSubmit,
  onCancel,
}) => (
  <form
    onSubmit={onSubmit}
    className="rounded-3xl border theme-border theme-surface p-6 shadow-sm space-y-6 h-full flex flex-col"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
      <InputField
        icon={<Person />}
        label="الاسم الكامل"
        name="name"
        value={form.name}
        onChange={onChange}
        disabled={!isEditing || isSaving} // ✅ يُعطّل أثناء الحفظ
      />
      <InputField
        icon={<Mail />}
        label="البريد الإلكتروني"
        name="email"
        value={form.email}
        onChange={onChange}
        disabled={!isEditing || isSaving}
      />
      <InputField
        icon={<AlternateEmail />}
        label="الاسم المستعار"
        name="nick_name"
        value={form.nick_name}
        onChange={onChange}
        disabled={!isEditing || isSaving}
      />
      <InputField
        icon={<Phone />}
        label="رقم الهاتف"
        name="number"
        value={form.number}
        onChange={onChange}
        disabled={!isEditing || isSaving}
      />
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold theme-text mb-2">
          <Cake fontSize="small" /> تاريخ الميلاد
        </label>
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={onChange}
          disabled={!isEditing || isSaving}
          className="w-full rounded-xl border theme-border theme-surface px-4 py-2.5 text-sm theme-text outline-none disabled:opacity-60 transition-colors"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold theme-text mb-2">
          <Wc fontSize="small" /> الجنس
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={onChange}
          disabled={!isEditing || isSaving}
          className="w-full rounded-xl border theme-border theme-surface px-4 py-2.5 text-sm theme-text outline-none disabled:opacity-60 transition-colors"
        >
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
      </div>

      {isEditing && (
        <>
          <div className="sm:col-span-2 border-t theme-border my-2 pt-4">
            <h3 className="text-sm font-bold theme-text-accent mb-1">
              تغيير كلمة المرور
            </h3>
            <p className="text-xs theme-text-muted mb-3">
              اترك الحقول فارغة إذا كنت لا ترغب في تغييرها.
            </p>
          </div>

          <InputField
            icon={<Lock />}
            label="كلمة المرور الحالية"
            name="current_password"
            type="password"
            value={form.current_password}
            onChange={onChange}
            disabled={isSaving}
          />
          <InputField
            icon={<Lock />}
            label="كلمة المرور الجديدة"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            disabled={isSaving}
          />
          <InputField
            icon={<Lock />}
            label="تأكيد كلمة المرور الجديدة"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={onChange}
            disabled={isSaving}
          />
        </>
      )}
    </div>

    {isEditing && (
      <div className="flex justify-end gap-3 pt-4 border-t theme-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border theme-border theme-surface px-6 py-2.5 text-sm font-semibold theme-text cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex cursor-pointer items-center gap-2 rounded-xl theme-accent px-6 py-2.5 text-sm font-bold theme-text-on-accent shadow-md disabled:opacity-70 transition-all"
        >
          {isSaving ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save fontSize="small" />
              حفظ التغييرات
            </>
          )}
        </button>
      </div>
    )}
  </form>
);

export default ProfileForm;
