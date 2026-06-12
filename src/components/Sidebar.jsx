import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  toggleCollapse,
  closeMobileMenu,
  showSnackbar,
} from "../features/uiSlice";
import { logout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../services/authService";

// MUI Icons
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import PersonIcon from "@mui/icons-material/Person";

import LogoutModal from "../pages/Login/Components/LogoutModal"; // استيراد المكون الجديد


const navItems = [
  {
    id: 2,
    name: "الحجوزات",
    icon: <FolderSharedIcon />,
    path: "/main-page/appointments",
  },
  {
    id: 2,
    name: "برنامج الدوام",
    icon: <CalendarMonthIcon />,
    path: "/main-page/schedule",
  },
  {
    id: 3,
    name: "سجل مواعيد المرضى",
    icon: <FolderSharedIcon />,
    path: "/main-page/patients-records",
  },
  
];

const Sidebar = () => {
  const { isCollapsed, isMobileOpen } = useSelector((state) => state.ui);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    if (logoutMutation.isPending) return;
    logoutMutation.mutate(token, {
      onSuccess: () => {
        setLogoutModalOpen(false);
        dispatch(logout());
        navigate("/");
        dispatch(
          showSnackbar({
            message: "تم تسجيل الخروج بنجاح",
            variant: "success",
          })
        );
      },
      onError: () => {
        dispatch(
          showSnackbar({
            message: "تعذر تسجيل الخروج. حاول لاحقاً.",
            variant: "error",
          })
        );
        // يمكن إغلاق المودال أيضاً بعد الخطأ أو تركه مفتوحاً لإعادة المحاولة، حسب المتطلبات
        setLogoutModalOpen(false);
      },
    });
  };

  return (
    <>
      {/* Overlay للجوال فقط */}
      <AnimatePresence>
        {isMobileOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeMobileMenu())}
            className="fixed inset-0 theme-overlay z-6000 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <Motion.nav
        initial={false}
        animate={{
          width: window.innerWidth >= 768 ? (isCollapsed ? 80 : 280) : 280,
          x: window.innerWidth < 768 ? (isMobileOpen ? 0 : "100%") : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-screen min-h-0 border-l theme-border theme-surface-90 backdrop-blur-xl shadow-2xl flex flex-col z-7000 overflow-hidden rtl"
      >
        {/* Header Section */}
        <div className="p-6 flex flex-col items-center border-b theme-border relative">
          <Motion.div
            layout
            className="w-12 h-12 rounded-xl theme-accent flex items-center justify-center shrink-0 theme-text-on-accent shadow-lg"
          >
            <MedicalServicesIcon />
          </Motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <Motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-3"
              >
                <h1 className="text-lg font-bold theme-text whitespace-nowrap">
                  مركز الشفاء الطبي
                </h1>
                <p className="text-[10px] theme-text-muted font-medium">
                  نظام الإدارة المتكامل
                </p>
              </Motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => dispatch(toggleCollapse())}
            className="hidden md:flex cursor-pointer absolute left-1 top-2 theme-surface border theme-border rounded-full p-1 shadow-md theme-hover-accent theme-text-muted transition-all active:scale-90"
          >
            {isCollapsed ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </button>

          <button
            onClick={() => dispatch(closeMobileMenu())}
            className="md:hidden absolute left-4 top-6 theme-text-muted"
          >
            <CloseIcon />
          </button>
        </div>

        {/* القائمة */}
        <div className="flex-1 min-h-0 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar overscroll-contain">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/main-page"}
              onClick={() => window.innerWidth < 768 && dispatch(closeMobileMenu())}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "theme-accent-strong theme-text-on-accent theme-shadow-accent"
                    : "theme-text-muted theme-hover-surface theme-hover-text-accent"
                }
              `}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <Motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap text-right flex-1"
                  >
                    {item.name}
                  </Motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </div>

        {/* Footer مع زر يفتح المودال */}
        <div className="p-4 border-t theme-border">
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 theme-text-danger theme-hover-danger rounded-xl cursor-pointer transition-colors group"
          >
            {!isCollapsed && (
              <Motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                تسجيل الخروج
              </Motion.span>
            )}
            <LogoutIcon className="shrink-0 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </Motion.nav>

      {/* مودال تأكيد تسجيل الخروج */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={logoutMutation.isPending}
      />
    </>
  );
};

export default Sidebar;
