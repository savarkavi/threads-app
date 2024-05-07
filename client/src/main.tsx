import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/auth-provider.tsx";
import { ConversationsContextProvider } from "./context/conversations-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthContextProvider>
          <ConversationsContextProvider>
            <App />
          </ConversationsContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
