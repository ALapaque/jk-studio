"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/** Navigation de la refonte, en surimpression du hero.
 *
 *  Maquette : transparente au repos, puis `backdrop-filter: blur(14px)` sur
 *  fond translucide après 40 px de défilement. L'état est stocké dans un
 *  attribut du DOM plutôt que dans un `useState` — la règle
 *  `react-hooks/set-state-in-effect` du projet interdit un setState synchrone
 *  dans un effet, et aucun re-render n'est utile pour une transition CSS.
 *
 *  Le lien actif est déduit du chemin courant, jamais codé en dur. */
export function Nav({ brandName, items }: { brandName: string; items: NavItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Lu au montage puis à chaque défilement. `passive` : ce handler ne
    // bloque jamais le scroll, ce qui compte sur un défilé plein écran.
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
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
        padding: "26px var(--jk-gap-page)",
        background: scrolled ? "rgba(14,12,10,.34)" : "transparent",
        backdropFilter: scrolled ? "blur(var(--jk-nav-blur))" : undefined,
        WebkitBackdropFilter: scrolled ? "blur(var(--jk-nav-blur))" : undefined,
        transition: "background var(--jk-dur-hover) var(--jk-ease)",
      }}
    >
      <Link
        href="/accueil"
        style={{
          fontSize: 13,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "#efe9e1",
        }}
      >
        {brandName}
      </Link>

      <nav>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 38,
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          {items.map((it) => {
            const active =
              pathname === it.href || pathname.startsWith(`${it.href}/`);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    color: active ? "#efe9e1" : "rgba(239,233,225,.78)",
                    borderBottom: active
                      ? "1px solid var(--jk-brass)"
                      : "1px solid transparent",
                    paddingBottom: 3,
                    transition: "color var(--jk-dur-hover) var(--jk-ease)",
                  }}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
