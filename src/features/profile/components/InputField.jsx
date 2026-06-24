import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

export default InputField;