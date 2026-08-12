"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, persistTheme, readStoredTheme, toggleTheme, type Theme } from "@/lib/theme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    // SSR-safe: reads a browser-only global (localStorage) once after mount, by design
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readStoredTheme(window.localStorage));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistTheme(window.localStorage, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => toggleTheme(t)) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
