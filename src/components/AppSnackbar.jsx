import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const VARIANT_STYLES = {
  success: "bg-green-50 text-green-700 border-green-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
};

const VARIANT_ICONS = {
  success: CheckCircleOutlineIcon,
  error: ErrorOutlineIcon,
  info: InfoOutlinedIcon,
  warning: WarningAmberOutlinedIcon,
};

export default function AppSnackbar({
  open,
  message,
  variant = "success",
  duration = 2000,
  onClose,
}) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(open);
  const exitDuration = 220;

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    const timer = setTimeout(() => setShouldRender(false), exitDuration);
    return () => clearTimeout(timer);
  }, [open]);

  if (!shouldRender) return null;

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.success;
  const Icon = VARIANT_ICONS[variant] || VARIANT_ICONS.success;

  const content = (
    <div className="fixed bottom-5 left-5 z-50000 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto w-[calc(100vw-2.5rem)] max-w-[480px] rounded-[14px] border px-5 py-3 text-left shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200 ease-out transform-gpu ${styles} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <Icon className="mt-0.5 !w-[18px] !h-[18px] shrink-0" />
          <p className="text-[13px] md:text-[14px] font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
