"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./motion/TransitionLink";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import type { Brand, NavContent } from "./SiteChrome";

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

export function Header({ brand, nav }: { brand: Brand; nav: NavContent }) {
  const pathname = usePathname();
  const isWork = pathname.startsWith("/travaux");
  const isAbout = pathname.startsWith("/a-propos");
  const isContact = pathname.startsWith("/contact");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
          display: "inline-flex",
          alignItems: "center",
          color: "#ffffff",
          fontFamily: "var(--font-serif), serif",
          fontSize: 23,
          letterSpacing: "0.01em",
        }}
      >
        {brand.logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoSrc}
            alt={brand.name}
            style={{ height: 28, width: "auto", display: "block" }}
          />
        ) : (
          brand.name
        )}
      </TransitionLink>
      <nav className="jk-nav-inline">
        <TransitionLink
          href="/travaux"
          transitionLabel={nav.work}
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isWork)}
        >
          {nav.work}
        </TransitionLink>
        <TransitionLink
          href="/a-propos"
          transitionLabel={nav.about}
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isAbout)}
        >
          {nav.about}
        </TransitionLink>
        <TransitionLink
          href="/contact"
          transitionLabel={nav.contact}
          data-cursor="link"
          className="jk-nav-link"
          style={navBtn(isContact)}
        >
          {nav.contact}
        </TransitionLink>
        <ThemeToggle />
      </nav>

      {/* burger — mobile uniquement (voir .jk-nav-toggle dans globals.css) */}
      <button
        type="button"
        className="jk-nav-toggle"
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          margin: -6,
          color: "#ffffff",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-end",
        }}
      >
        <span style={{ display: "block", width: 26, height: 1.4, background: "#ffffff" }} />
        <span style={{ display: "block", width: 18, height: 1.4, background: "#ffffff" }} />
      </button>
    </header>

    <MobileMenu
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      brand={brand}
      nav={nav}
    />
    </>
  );
}
