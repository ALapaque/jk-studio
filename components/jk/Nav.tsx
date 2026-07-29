"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/** Navigation de la refonte, en surimpression du hero.
 *
 *  Desktop : liens déployés à droite, transparents au repos puis
 *  `backdrop-filter: blur(14px)` après 40 px de défilement.
 *
 *  Mobile : la maquette (écran 06) remplace les liens par une entrée
 *  « Menu » en laiton, qui ouvre un panneau plein écran. Sans ça, les quatre
 *  libellés s'empilent en colonne et recouvrent le contenu — c'était le cas
 *  avant ce correctif.
 *
 *  Le lien actif est déduit du chemin courant, jamais codé en dur. */
export function Nav({
  brandName,
  items,
  menuLabel,
  closeLabel,
}: {
  brandName: string;
  items: NavItem[];
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  // L'état de défilement est écrit en attribut sur le noeud, pas en state :
  // la règle `react-hooks/set-state-in-effect` du projet interdit un setState
  // synchrone dans un effet, et surtout un state re-rendrait la nav à chaque
  // pixel de scroll — coûteux sur une page en défilé plein écran. Le style
  // correspondant vit dans jk-tokens.css.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 40) el.dataset.scrolled = "true";
      else delete el.dataset.scrolled;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Échap ferme, et le défilement de fond est bloqué tant que le panneau est
  // ouvert — sinon la page glisse derrière lui.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        ref={headerRef}
        className="jk-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "18px var(--jk-gap-page)",
        }}
      >
        <Link
          href="/accueil"
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#efe9e1",
          }}
        >
          {brandName}
        </Link>

        {/* Liens déployés — masqués sous 760px par .jk-nav-links */}
        <nav className="jk-nav-links">
          <ul
            style={{
              display: "flex",
              gap: 38,
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={isActive(it.href) ? "page" : undefined}
                  style={{
                    color: isActive(it.href) ? "#efe9e1" : "rgba(239,233,225,.78)",
                    borderBottom: isActive(it.href)
                      ? "1px solid var(--jk-brass)"
                      : "1px solid transparent",
                    paddingBottom: 3,
                    transition: "color var(--jk-dur-hover) var(--jk-ease)",
                  }}
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Entrée « Menu » — visible uniquement sous 760px */}
        <button
          type="button"
          className="jk-nav-toggle"
          aria-expanded={open}
          aria-controls="jk-menu"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            cursor: "pointer",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--jk-brass)",
            fontFamily: "inherit",
          }}
        >
          {open ? closeLabel : menuLabel}
        </button>
      </header>

      {open && (
        <div
          id="jk-menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            background: "var(--jk-bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 8,
            padding: "0 var(--jk-gap-page)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {items.map((it) => (
              <li
                key={it.href}
                style={{ borderTop: "1px solid var(--jk-rule)" }}
              >
                <Link
                  href={it.href}
                  aria-current={isActive(it.href) ? "page" : undefined}
                  // Ferme au clic plutôt que via un effet sur le chemin :
                  // le panneau ne doit pas rester ouvert sur la page d'arrivée,
                  // et un setState dans un effet violerait
                  // `react-hooks/set-state-in-effect`.
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "22px 0",
                    fontFamily: "var(--jk-serif)",
                    fontSize: "clamp(30px, 9vw, 44px)",
                    lineHeight: 1.1,
                    color: isActive(it.href)
                      ? "var(--jk-brass)"
                      : "var(--jk-ink)",
                  }}
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
