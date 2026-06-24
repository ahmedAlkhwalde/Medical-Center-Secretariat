import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleRememberMe, setCredentials } from "../store/authSlice";
import { hideSnackbar } from "../../uiSlice";
import { useLoginMutation } from "../service/authService";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const { rememberMe, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;
    if (!pendingRedirect) {
      navigate("/main-page");
      return;
    }
    const timer = setTimeout(() => {
      navigate("/main-page");
    }, 700);
    return () => clearTimeout(timer);
  }, [token, pendingRedirect, navigate]);

  const validateForm = () => {
    const tempErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }
    if (password.length < 8) {
      tempErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(hideSnackbar());
    setErrors({});

    if (validateForm()) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            // التحقق من وجود التوكن، والرسائل السلبية تم إطلاقها في الـ service بالفعل
            if (!data?.token) return;

            dispatch(
              setCredentials({
                token: data.token,
                user: data.user ?? null,
                rememberMe,
                lastUsedEmail: email,
              })
            );
            
            setPendingRedirect(true);
          },
        }
      );
    }
  };

  const handleToggleRememberMe = () => {
    dispatch(toggleRememberMe());
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    rememberMe,
    isPending: loginMutation.isPending,
    handleLogin,
    handleToggleRememberMe,
  };
};