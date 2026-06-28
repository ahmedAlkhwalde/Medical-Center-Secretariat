import "./App.css";
import React, { useEffect, useRef } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Layout from "./components/Layout";
import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerifyResetCodePage from "./features/auth/pages/VerifyResetCodePage";
import NewPasswordPage from "./features/auth/pages/NewPasswordPage";
import SchedulePage from "./features/schedule/pages/SchedulePage";
import PatientsRecordsPage from "./features/patients/pages/PatientsRecordsPage";
import AppointmentsPage from "./features/appointment/pages/AppointmentsPage";
import ChatList from "./features/chat/pages/ChatList";
import Conversation from "./features/chat/pages/Conversation";
import NotificationPage from "./features/notification/pages/NotificationPage";
import ProfilePage from "./features/profile/pages/ProfilePage";

import { applyThemeMode } from "./app/theme";
import notificationService from "./features/notification/service/notificationChatService";
import AppSnackbar from "./components/AppSnackbar";
import { hideSnackbar } from "./features/uiSlice";
import NotFoundPage from "./components/NotFoundPage";

const VALID_MAIN_PATHS = [
  "",
  "schedule",
  "patients-records",
  "appointments",
  "notifications",
  "conversations",
  "profile",
];

const MainPageRouter = () => {
  const location = useLocation();

  const subPath = location.pathname.replace("/main-page", "").replace(/^\//, "");

  const isValidPath =
    VALID_MAIN_PATHS.includes(subPath) ||
    VALID_MAIN_PATHS.some((path) => subPath.startsWith(path + "/"));

  if (!isValidPath) {
    return <NotFoundPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<AppointmentsPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="patients-records" element={<PatientsRecordsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="conversations" element={<ChatList />} />
        <Route path="conversations/view/:id" element={<Conversation />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
};

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const token = useSelector((state) => state.auth.token);
  const snackbar = useSelector((state) => state.ui.snackbar);
  const dispatch = useDispatch();

  const isAuthed = Boolean(token);
  const isTokenProcessed = useRef(false);

  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        notificationService.initializeFCM(isTokenProcessed);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const unsubscribe = notificationService.listenToForegroundMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [token]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            isAuthed ? <Navigate to="/main-page" replace /> : <LoginPage />
          }
        />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/verify"
          element={<VerifyResetCodePage />}
        />
        <Route
          path="/reset-password/new-password"
          element={<NewPasswordPage />}
        />

        <Route
          path="/main-page/*"
          element={
            isAuthed ? <MainPageRouter /> : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        duration={snackbar.duration}
        onClose={() => dispatch(hideSnackbar())}
      />
    </div>
  );
}

export default App;