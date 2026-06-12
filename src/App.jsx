import "./App.css";
import MainPage from "./pages/MainPage";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/Login/VerifyResetCodePage";
import NewPasswordPage from "./pages/Login/NewPasswordPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyThemeMode } from "./app/theme";
import AppSnackbar from "./components/AppSnackbar";
import { hideSnackbar } from "./features/uiSlice";

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const token = useSelector((state) => state.auth.token);
  const snackbar = useSelector((state) => state.ui.snackbar);
  const dispatch = useDispatch();
  const isAuthed = Boolean(token);

  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  return (
    <div className="App">
      {/* <MainPage/> */}
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
          element={isAuthed ? <MainPage /> : <Navigate to="/" replace />}
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
