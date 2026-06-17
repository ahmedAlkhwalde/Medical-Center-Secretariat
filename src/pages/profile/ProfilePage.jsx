import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion as Motion } from "framer-motion";
import {
  Person,
  Mail,
  Phone,
  Save,
  Edit,
  CameraAlt,
  Cake,
  Wc,
  AlternateEmail,
  Lock,
  Visibility,    // أيقونة العين (إظهار)
  VisibilityOff, // أيقونة العين عليها خط (إخفاء)
} from "@mui/icons-material";
import { useProfile } from "../../services/profileService";
import {
  startEditing,
  cancelEditing,
} from "../../features/profile/profileSlice";
import { showSnackbar } from "../../features/uiSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const isEditing = useSelector((state) => state.profile?.isEditing);
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    nick_name: "",
    gender: "male",
    number: "",
    birthday: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isCurrentlySaving = isUpdating || isSaving;

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        nick_name: profile.nick_name || "",
        gender: profile.gender || "male",
        number: profile.number || "",
        birthday: profile.birthday || "",
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setImagePreview(profile.image || null);
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (form.password) {
      if (!form.current_password) {
        dispatch(
          showSnackbar({ message: "يرجى إدخال كلمة المرور الحالية لتغييرها", variant: "error" })
        );
        return;
      }
      if (form.password !== form.password_confirmation) {
        dispatch(
          showSnackbar({ message: "كلمة المرور الجديدة وتأكيدها غير متطابقين", variant: "error" })
        );
        return;
      }
    }

    const profileKeys = ["name", "email", "nick_name", "gender", "number", "birthday"];
    if (profile) {
      profileKeys.forEach((key) => {
        if (form[key] !== (profile[key] ?? "")) {
          formData.append(key, form[key]);
        }
      });
    }

    if (form.password) {
      formData.append("current_password", form.current_password);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
    }

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    if (Array.from(formData.keys()).length === 0) {
      dispatch(cancelEditing());
      dispatch(
        showSnackbar({ message: "لم يتم إجراء أي تغييرات", variant: "info" }),
      );
      return;
    }

    setIsSaving(true);

    updateProfile(formData, {
      onSuccess: (response) => {
        setIsSaving(false);
        dispatch(cancelEditing());
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        setForm(prev => ({
          ...prev,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));

        dispatch(
          showSnackbar({
            message: response?.message || "تم تحديث الحساب بنجاح",
            variant: "success",
          }),
        );
      },
      onError: (error) => {
        setIsSaving(false);
        dispatch(
          showSnackbar({
            message:
              error?.response?.data?.message || "فشل في تحديث البيانات",
            variant: "error",
          }),
        );
      },
    });
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        nick_name: profile.nick_name || "",
        gender: profile.gender || "male",
        number: profile.number || "",
        birthday: profile.birthday || "",
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setImagePreview(profile.image || null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <section className="w-full min-w-0 space-y-6">
        <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 p-4 sm:p-6 animate-pulse">
          <div className="h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 mb-2" />
          <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border theme-border theme-surface p-6 animate-pulse">
            <div className="mx-auto w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-4 h-5 w-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-4 w-32 mx-auto rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="lg:col-span-2 rounded-3xl border theme-border theme-surface p-6 animate-pulse space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx}>
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                  <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* العنوان */}
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              الملف الشخصي
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إدارة معلومات حسابك الشخصي وتحديثها وتغيير كلمة المرور بسهولة.
            </p>
          </div>
          {!isEditing && (
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch(startEditing())}
              className="flex cursor-pointer items-center gap-2 rounded-xl theme-accent px-5 py-2.5 text-sm font-bold theme-text-on-accent shadow-lg self-end"
            >
              <Edit fontSize="small" />
              تعديل البيانات
            </Motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* بطاقة الصورة */}
        <div className="lg:col-span-1 h-full">
          <div className="rounded-3xl border theme-border theme-surface p-6 shadow-sm text-center h-full flex flex-col justify-center">
            <div className="relative mx-auto w-40 h-40">
              <img
                src={
                  imagePreview ||
                  `https://ui-avatars.com/api/?name=${profile?.name || "U"}&size=160&background=0AB3BA&color=fff`
                }
                alt="صورة المستخدم"
                className="w-full h-full rounded-full object-cover border-4 theme-border shadow-md"
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isCurrentlySaving}
                    className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CameraAlt fontSize="small" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold theme-text">
              {profile?.name}
            </h2>
            <p className="text-sm theme-text-muted">{profile?.email}</p>
          </div>
        </div>

        {/* نموذج التفاصيل */}
        <div className="lg:col-span-2 h-full">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border theme-border theme-surface p-6 shadow-sm space-y-6 h-full flex flex-col"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              <InputField
                icon={<Person />}
                label="الاسم الكامل"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!isEditing || isCurrentlySaving}
              />
              <InputField
                icon={<Mail />}
                label="البريد الإلكتروني"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing || isCurrentlySaving}
              />
              <InputField
                icon={<AlternateEmail />}
                label="الاسم المستعار"
                name="nick_name"
                value={form.nick_name}
                onChange={handleChange}
                disabled={!isEditing || isCurrentlySaving}
              />
              <InputField
                icon={<Phone />}
                label="رقم الهاتف"
                name="number"
                value={form.number}
                onChange={handleChange}
                disabled={!isEditing || isCurrentlySaving}
              />
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold theme-text mb-2">
                  <Cake fontSize="small" />
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  disabled={!isEditing || isCurrentlySaving}
                  className="w-full rounded-xl border theme-border theme-surface px-4 py-2.5 text-sm theme-text outline-none disabled:opacity-60 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold theme-text mb-2">
                  <Wc fontSize="small" />
                  الجنس
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!isEditing || isCurrentlySaving}
                  className="w-full rounded-xl border theme-border theme-surface px-4 py-2.5 text-sm theme-text outline-none disabled:opacity-60 transition-colors"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              {/* حقول كلمة المرور */}
              {isEditing && (
                <>
                  <div className="sm:col-span-2 border-t theme-border my-2 pt-4">
                    <h3 className="text-sm font-bold theme-text-accent mb-1">تغيير كلمة المرور</h3>
                    <p className="text-xs theme-text-muted mb-3">اترك الحقول فارغة إذا كنت لا ترغب في تغييرها.</p>
                  </div>

                  <InputField
                    icon={<Lock />}
                    label="كلمة المرور الحالية"
                    name="current_password"
                    type="password"
                    value={form.current_password}
                    onChange={handleChange}
                    disabled={isCurrentlySaving}
                  />
                  <InputField
                    icon={<Lock />}
                    label="كلمة المرور الجديدة"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={isCurrentlySaving}
                  />
                  <InputField
                    icon={<Lock />}
                    label="تأكيد كلمة المرور الجديدة"
                    name="password_confirmation"
                    type="password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    disabled={isCurrentlySaving}
                  />
                </>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t theme-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isCurrentlySaving}
                  className="rounded-xl border theme-border theme-surface px-6 py-2.5 text-sm font-semibold theme-text cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCurrentlySaving}
                  className="flex cursor-pointer items-center gap-2 rounded-xl theme-accent px-6 py-2.5 text-sm font-bold theme-text-on-accent shadow-md disabled:opacity-70 transition-all"
                >
                  {isCurrentlySaving ? (
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
        </div>
      </div>
    </section>
  );
};

// تعديل مكوّن الـ InputField ليحتوي على حالة إظهار وإخفاء الباسوورد بشكل مستقل ومحاذاته جهة اليسار (لأن الـ UI عربي)
const InputField = ({ icon, label, name, value, onChange, disabled, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold theme-text mb-2">
        {icon}
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-xl border theme-border theme-surface py-2.5 text-sm theme-text outline-none disabled:opacity-60 transition-colors focus:ring-2 focus:ring-teal-500/50 ${
            isPassword ? "pl-12 pr-4" : "px-4"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;