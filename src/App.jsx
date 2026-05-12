import "./App.css";
import MainPage from "./pages/MainPage";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyResetCodePage from "./pages/Login/VerifyResetCodePage";
import NewPasswordPage from "./pages/Login/NewPasswordPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { applyThemeMode } from "./app/theme";

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);

  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  return (
    <div className="App">
      {/* <MainPage/> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/verify"
          element={<VerifyResetCodePage />}
        />
        <Route
          path="/reset-password/new-password"
          element={<NewPasswordPage />}
        />
        <Route path="/main-page/*" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
