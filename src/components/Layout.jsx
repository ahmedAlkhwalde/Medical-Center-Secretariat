import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { toggleDarkMode } from "../features/uiSlice";

const Layout = ({ children }) => {
  const { isCollapsed, darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const isDark = darkMode;

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="min-h-screen theme-bg flex flex-col md:flex-row-reverse rtl font-['Almarai']">
      <Sidebar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* المحتوى الرئيسي يتوسع حسب حالة الدراور (للتاب واللابتوب) */}
      <Motion.main
        initial={false}
        animate={{
          marginRight: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 min-w-0"
      >
        <Header isDark={isDark} onToggleTheme={toggleTheme} />
        <div className="px-3 py-4 sm:px-4 md:px-8 lg:px-10">{children}</div>
      </Motion.main>
    </div>
  );
};

export default Layout;
