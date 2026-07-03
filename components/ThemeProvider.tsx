"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Appearance,
  DEFAULT_APPEARANCE,
  STORAGE_KEY,
  Theme,
  buildThemeVars,
} from "@/lib/theme";

interface ThemeCtx {
  theme: Theme;
  appearance: Appearance;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function applyVars(theme: Theme, appearance: Appearance) {
  const vars = buildThemeVars(theme, appearance);
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  root.dataset.theme = theme;
  root.style.background = vars["--bg"];
  document.body.style.background = vars["--bg"];
}

export function ThemeProvider({
  appearance = DEFAULT_APPEARANCE,
  children,
}: {
  appearance?: Appearance;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(appearance.defaultTheme);

  // Reprend le choix persisté au montage.
  useEffect(() => {
    let initial = appearance.defaultTheme;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") initial = saved;
    } catch {}
    setThemeState(initial);
    applyVars(initial, appearance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Réapplique quand le thème ou l'apparence changent.
  useEffect(() => {
    applyVars(theme, appearance);
  }, [theme, appearance]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, appearance, toggle, setTheme }),
    [theme, appearance, toggle, setTheme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme doit être utilisé dans <ThemeProvider>");
  return c;
}

