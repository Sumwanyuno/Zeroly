// client/src/context/ThemeContext.jsx
// Wraps next-themes to provide a centralized ThemeContext for the app.
// - Reads from localStorage via next-themes (key: "zeroly-theme")
// - Falls back to prefers-color-scheme when no saved preference exists
// - Exposes { theme, resolvedTheme, setTheme, toggleTheme } to consumers

import React, { createContext, useContext, useCallback } from "react";
import { useTheme } from "next-themes";

export const ThemeContext = createContext(null);

/**
 * ThemeProvider is already set up in main.jsx using next-themes.
 * This context simply bridges next-themes to the rest of the app
 * with a convenient API and the correct localStorage key.
 */
export function ThemeContextProvider({ children }) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  // Cycle: system → light → dark → light
  const toggleTheme = useCallback(() => {
    if (theme === "system" || theme === undefined) {
      // First manual toggle from system default
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, systemTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useThemeContext — consume ThemeContext safely.
 * Must be used inside <ThemeContextProvider>.
 */
export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }
  return ctx;
}
