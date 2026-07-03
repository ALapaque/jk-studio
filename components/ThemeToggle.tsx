"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const label =
    theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre";
  return (
    <button
      onClick={toggle}
      data-cursor="link"
      aria-label={label}
      title={label}
      style={{
        background: "none",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 999,
        width: 30,
        height: 30,
        display: "grid",
        placeItems: "center",
        padding: 0,
        color: "#ffffff",
        fontSize: 13,
        lineHeight: 1,
      }}
    >
      {theme === "dark" ? "◐" : "◑"}
    </button>
  );
}
