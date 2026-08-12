"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, persistTheme, readStoredTheme, toggleTheme, type Theme } from "@/lib/theme";
import { DEFAULT_ACCENT, persistAccent, readStoredAccent, type Accent } from "@/lib/accent";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT);

  useEffect(() => {
    // SSR-safe: reads browser-only globals (localStorage) once after mount, by design
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readStoredTheme(window.localStorage));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccentState(readStoredAccent(window.localStorage));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistTheme(window.localStorage, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    persistAccent(window.localStorage, accent);
  }, [accent]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => toggleTheme(t)),
        accent,
        setAccent: (a: Accent) => setAccentState(a),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
