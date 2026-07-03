"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "./motion/TransitionLink";
import { ThemeToggle } from "./ThemeToggle";

const navBtn = (active: boolean): React.CSSProperties => ({
  background: "none",
  border: "none",
  padding: 0,
  color: "#ffffff",
  opacity: active ? 1 : 0.6,
  fontFamily: "var(--font-mono), monospace",
  fontSize: 10.5,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
});

export function Header() {
  const pathname = usePathname();
  const isWork = pathname.startsWith("/travaux");
  const isAbout = pathname.startsWith("/a-propos");
  const isContact = pathname.startsWith("/contact");

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        mixBlendMode: "difference",
        color: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px clamp(16px,4vw,56px)",
      }}
    >
      <TransitionLink
        href="/"
        transitionLabel="Accueil"
        data-cursor="link"
        style={{
          color: "#ffffff",
          fontFamily: "var(--font-serif), serif",
          fontSize: 23,
          letterSpacing: "0.01em",
        }}
      >
        JKStudio
      </TransitionLink>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(11px,2.6vw,34px)",
        }}
      >
        <TransitionLink
          href="/travaux"
          transitionLabel="Travaux"
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isWork)}
        >
          Travaux
        </TransitionLink>
        <TransitionLink
          href="/a-propos"
          transitionLabel="À propos"
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isAbout)}
        >
          À propos
        </TransitionLink>
        <TransitionLink
          href="/contact"
          transitionLabel="Contact"
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isContact)}
        >
          Contact
        </TransitionLink>
        <ThemeToggle />
      </nav>
    </header>
  );
}
