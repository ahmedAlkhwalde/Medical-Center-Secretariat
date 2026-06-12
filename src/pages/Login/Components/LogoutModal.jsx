import React from "react";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { motion, AnimatePresence } from "framer-motion";

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* خلفية شفافة معتمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* صندوق الحوار */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative theme-surface border theme-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              {/* أيقونة الخروج */}
              <div className="w-16 h-16 rounded-full theme-danger-soft flex items-center justify-center mb-6">
                <LogoutOutlinedIcon className="text-red-500 !w-8 !h-8" />
              </div>

              <h2 className="text-2xl font-bold theme-text mb-2">تسجيل الخروج</h2>
              <p className="text-sm theme-text-muted mb-8">
                هل أنت متأكد أنك تريد الخروج من حسابك؟ ستحتاج إلى تسجيل الدخول مرة أخرى.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer py-3 rounded-xl border theme-border font-semibold theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={18} color="inherit" />
                      جاري الخروج...
                    </>
                  ) : (
                    "تسجيل الخروج"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}