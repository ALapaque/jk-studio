"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { TransitionLink } from "./motion/TransitionLink";
import { ThemeToggle } from "./ThemeToggle";
import type { Brand, NavContent } from "./SiteChrome";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function MobileMenu({
  open,
  onClose,
  brand,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  brand: Brand;
  nav: NavContent;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const links = [
    { href: "/", label: "Accueil", exact: true },
    { href: "/travaux", label: nav.work },
    { href: "/a-propos", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Fermeture sur Échap + verrou du scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const container: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { staggerChildren: 0.07, delayChildren: 0.12 } },
  };
  const item: Variants = {
    hidden: reduce ? { y: "0%" } : { y: "110%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.6, ease: EASE } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 960,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            padding: "18px clamp(16px,6vw,40px) clamp(24px,6vw,48px)",
            overflowY: "auto",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* barre haute : marque + fermer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: 22,
                color: "var(--ink)",
              }}
            >
              {brand.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoSrc} alt={brand.name} style={{ height: 26, width: "auto" }} />
              ) : (
                brand.name
              )}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                margin: -8,
                color: "var(--ink)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                <path d="M6 6l14 14M20 6L6 20" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          {/* liens géants, reveal en cascade */}
          <motion.nav
            variants={container}
            initial="hidden"
            animate="show"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "clamp(8px,2vw,16px)",
              paddingTop: 24,
            }}
          >
            {links.map((l, i) => {
              const active = isActive(l.href, l.exact);
              return (
                <div key={l.href} style={{ overflow: "hidden", display: "flex" }}>
                  <motion.span variants={item} style={{ display: "block", width: "100%" }}>
                    <TransitionLink
                      href={l.href}
                      transitionLabel={l.label}
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 14,
                        color: "var(--ink)",
                        opacity: active ? 1 : 0.85,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 12,
                          color: "var(--accent)",
                          flex: "none",
                        }}
                      >
                        ({pad(i + 1)})
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "clamp(40px,9vw,72px)",
                          lineHeight: 1.02,
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {l.label}
                      </span>
                    </TransitionLink>
                  </motion.span>
                </div>
              );
            })}
          </motion.nav>

          {/* bas : thème + tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.45, duration: 0.4 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              borderTop: "1px solid var(--line)",
              paddingTop: 18,
            }}
          >
            {brand.tagline && (
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink2)",
                }}
              >
                {brand.tagline}
              </span>
            )}
            <ThemeToggle />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
