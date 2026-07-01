// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { ThemeContextProvider } from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      {/*
        next-themes ThemeProvider:
          - attribute="class"  → applies "dark" class to <html> (works with Tailwind dark:)
          - defaultTheme="system" → reads prefers-color-scheme on first visit
          - enableSystem → enables media query watching
          - storageKey="zeroly-theme" → named localStorage key per the issue spec
          - disableTransitionOnChange → prevents unstyled flash during theme swap
      */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="zeroly-theme"
        disableTransitionOnChange
      >
        {/* ThemeContextProvider bridges next-themes to our app's ThemeContext */}
        <ThemeContextProvider>
          <AuthProvider>
            <SocketProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SocketProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);