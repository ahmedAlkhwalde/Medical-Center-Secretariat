import "./App.css";
import React, { useEffect, useRef } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
    notificationService.initializeFCM(isTokenProcessed);
    const unsubscribe = notificationService.listenToForegroundMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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
        <Route path="/reset-password/verify" element={<VerifyResetCodePage />} />
        <Route path="/reset-password/new-password" element={<NewPasswordPage />} />

        {/* لوحة التحكم الرئيسية مع Layout */}
        <Route
          path="/main-page/*"
          element={
            isAuthed ? (
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
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
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