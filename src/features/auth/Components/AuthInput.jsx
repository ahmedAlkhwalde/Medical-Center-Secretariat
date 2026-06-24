import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { motion as Motion, AnimatePresence } from "framer-motion";

const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  isPassword = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-2 text-right group">
      <label
        className={`text-sm font-bold transition-all duration-300 inline-block ${error ? "theme-text-danger" : "theme-text-accent opacity-80 group-focus-within:opacity-100"}`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full py-3 px-5 
            theme-primary border rounded-2xl 
            outline-none transition-all duration-300 
            text-sm theme-text text-right appearance-none
            ${
              error
                ? "border-(--color-danger) focus:shadow-[0_10px_25px_-5px_var(--color-danger-soft)]"
                : "theme-border focus:border-(--color-accent) focus:shadow-[0_10px_25px_-5px_var(--color-shadow-accent)]"
            }
            focus:-translate-y-px
          `}
        />

        {isPassword && (
          <div className="absolute inset-y-0 left-3 flex items-center">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              size="small"
              sx={{
                color: error ? "var(--color-danger)" : "var(--color-grey)",
                "&:hover": { color: "var(--color-accent)" },
              }}
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </IconButton>
          </div>
        )}
      </div>

      {/* عرض رسالة الخطأ بحركة انسيابية */}
      <AnimatePresence>
        {error && (
          <Motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs font-bold theme-text-danger mt-1 pr-1"
          >
            {error}
          </Motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthInput;
