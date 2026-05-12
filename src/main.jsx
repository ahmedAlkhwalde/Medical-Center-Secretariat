// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { BrowserRouter } from "react-router-dom";
// const queryClient = new QueryClient();
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <BrowserRouter>
//       <QueryClientProvider client={queryClient}>
//         <App />
//         <ReactQueryDevtools />
//       </QueryClientProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store } from "./store/store.js"; // التعديل هنا: استدعاء الـ store الشامل
import App from "./App.jsx";
import "./index.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);