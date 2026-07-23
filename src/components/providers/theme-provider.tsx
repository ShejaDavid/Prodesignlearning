"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "light";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// Renders no <script> of its own — the FOUC-prevention script lives in the
// root layout (a Server Component) instead. A Client Component rendering a
// raw <script> tag re-executes its render on every client render, which is
// what produces the "script tag" warning and the hydration mismatch that
// comes with it. This provider only reads/writes the DOM imperatively.
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads from the same source (localStorage) as the inline
  // script in layout.tsx, so this first client render matches what the
  // script already applied to the DOM before hydration.
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
