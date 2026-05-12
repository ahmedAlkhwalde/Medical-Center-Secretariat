import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { applyThemeMode, getInitialThemeMode } from "./app/theme";

applyThemeMode(getInitialThemeMode());

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
          {/* <ReactQueryDevtools /> */}
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
