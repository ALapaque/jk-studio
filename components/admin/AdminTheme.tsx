"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "jk-admin-theme";

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const AdminThemeContext = createContext<Ctx>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

// Script anti-FOUC : applique la classe `.dark` sur le conteneur AVANT le
// premier paint, en lisant localStorage. Rendu tel quel côté serveur et
// client (le className JSX reste « admin-root »), donc aucun mismatch
// d'hydratation ; la classe est gérée impérativement.
const NO_FLASH = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'dark';var e=document.currentScript&&document.currentScript.parentElement;if(e&&t==='dark')e.classList.add('dark');}catch(_){}})();`;

/**
 * Fournit le thème clair/sombre de l'admin ET rend le conteneur `.admin-root`
 * qui porte les variables shadcn (scopées, sans impact sur le site public).
 */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setThemeState] = useState<Theme>("dark");

  // Lecture initiale (client) pour synchroniser l'état du contexte.
  useEffect(() => {
    let stored: Theme = "dark";
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "light" || s === "dark") stored = s;
    } catch {}
    setThemeState(stored);
  }, []);

  // Applique la classe de façon impérative (l'anti-FOUC a déjà posé l'état
  // initial ; ici on suit les changements de thème).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.toggle("dark", theme === "dark");
  }, [theme]);

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

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggle }}>
      <div ref={ref} className="admin-root" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
