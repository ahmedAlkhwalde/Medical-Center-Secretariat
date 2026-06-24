import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useProfile } from "../service/profileService";
import { cancelEditing } from "../store/profileSlice";

export const useProfileForm = (isEditing) => {
  const dispatch = useDispatch();
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
  const [localSaving, setLocalSaving] = useState(false); // ✅ حالة حفظ محلية

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
    if (file) setImagePreview(URL.createObjectURL(file));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // ✅ تفعيل حالة الحفظ المحلية فوراً
    setLocalSaving(true);

    // التحقق من كلمة المرور
    if (form.password) {
      if (!form.current_password || form.password !== form.password_confirmation) {
        setLocalSaving(false); // إيقاف السبينر في حال فشل التحقق
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
      setLocalSaving(false); // ✅ إيقاف السبينر إذا لم تكن هناك تغييرات
      return;
    }

    updateProfile(formData, {
      onSuccess: () => {
        dispatch(cancelEditing());
        if (fileInputRef.current) fileInputRef.current.value = "";
        setForm(prev => ({
          ...prev,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
        setLocalSaving(false); // ✅ إيقاف السبينر بعد النجاح
      },
      onError: () => {
        setLocalSaving(false); // ✅ إيقاف السبينر بعد الفشل
      },
    });
  };

  return {
    profile,
    isLoading,
    isSaving: isUpdating || localSaving, // ✅ دمج الحالتين
    form,
    imagePreview,
    fileInputRef,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleCancel,
  };
};