"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/* Voile de transition plein écran entre les pages de la refonte.
 *
 * Porté à l'identique de l'ancien `TransitionProvider` (timings et courbes
 * inchangés) : le voile monte, le mot de la destination se remplit en
 * clip-path, on navigue sous le voile, puis il se retire vers le haut.
 *
 * DIFFÉRENCE D'INTÉGRATION avec l'ancien : plutôt que de remplacer chaque
 * `<Link>` par un lien spécial (l'ancien site utilisait `TransitionLink`),
 * on intercepte les clics de liens internes au niveau du document. Tous les
 * liens existants — nav, catégories, sélection, footer — déclenchent donc le
 * voile sans être touchés, et on évite de réintroduire le moteur d'animation
 * historique (214 Ko) pour ce seul effet.
 *
 * Tout est piloté par des refs et des styles inline : aucun state, donc aucun
 * re-render pendant l'animation, et la règle `react-hooks/set-state-in-effect`
 * du projet est respectée.
 *
 * Neutralisé sous `prefers-reduced-motion` : navigation directe, sans voile. */

const titleCase = (slug: string) =>
  slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/** Mot du voile déduit de l'URL de destination. Aucun libellé n'est écrit en
 *  dur dans un lien : la destination suffit à le nommer. */
function labelFromPath(path: string): string {
  let p = path;
  try {
    p = decodeURIComponent(path);
  } catch {}
  const seg = p.split("/").filter(Boolean);
  if (seg.length === 0) return "Accueil";
  if (seg[0] === "accueil") return "Accueil";
  if (seg[0] === "series") return "Séries";
  if (seg[0] === "tirages") return "Tirages";
  if (seg[0] === "a-propos") return "À propos";
  if (seg[0] === "contact") return "Contact";
  if (seg[0] === "travaux") {
    if (seg.length === 1) return "Travaux";
    // Une page « histoire » est nommée par sa série, pas par le mot histoire.
    const last = seg[seg.length - 1];
    return titleCase(last === "histoire" ? seg[seg.length - 2] : last);
  }
  return titleCase(seg[seg.length - 1]);
}

export function PageTransition({
  children,
  brandName,
}: {
  children: React.ReactNode;
  brandName: string;
}) {
  const router = useRouter();
  const ovRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string, label: string) => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const o = ovRef.current;
      if (busy.current) return;
      if (reduced || !o) {
        router.push(href);
        window.scrollTo(0, 0);
        return;
      }
      busy.current = true;
      if (labelRef.current) labelRef.current.textContent = label;
      if (fillRef.current) {
        fillRef.current.textContent = label;
        fillRef.current.style.transition = "none";
        fillRef.current.style.clipPath = "inset(0 100% 0 0)";
      }
      o.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
      o.style.transform = "translateY(0%)";
      setTimeout(() => {
        if (fillRef.current) {
          fillRef.current.style.transition =
            "clip-path .9s cubic-bezier(.65,0,.35,1)";
          void fillRef.current.offsetWidth;
          fillRef.current.style.clipPath = "inset(0 0% 0 0)";
        }
      }, 450);
      setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
      }, 720);
      setTimeout(() => {
        o.style.transform = "translateY(-101%)";
        setTimeout(() => {
          o.style.transition = "none";
          o.style.transform = "translateY(101%)";
          busy.current = false;
        }, 660);
      }, 1550);
    },
    [router],
  );

  // Interception des clics de liens internes. Seuls les liens gauche-clic
  // vers une route interne (href commençant par « / ») déclenchent le voile ;
  // clic modifié, cible _blank, ancre de page et liens externes suivent leur
  // comportement natif.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      e.preventDefault();
      navigate(href, labelFromPath(href));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // Précédent / Suivant du navigateur : App Router re-rend la page, ce qui
  // « clignote » sans voile. On couvre instantanément puis on retire en
  // douceur, comme l'ancien site.
  useEffect(() => {
    const onPop = () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const o = ovRef.current;
      if (!o || reduced || busy.current) return;
      busy.current = true;
      const label = labelFromPath(window.location.pathname);
      if (labelRef.current) labelRef.current.textContent = label;
      if (fillRef.current) {
        fillRef.current.textContent = label;
        fillRef.current.style.transition = "none";
        fillRef.current.style.clipPath = "inset(0 100% 0 0)";
      }
      o.style.transition = "none";
      o.style.transform = "translateY(0%)";
      void o.offsetWidth;
      setTimeout(() => {
        if (fillRef.current) {
          fillRef.current.style.transition =
            "clip-path .7s cubic-bezier(.65,0,.35,1)";
          void fillRef.current.offsetWidth;
          fillRef.current.style.clipPath = "inset(0 0% 0 0)";
        }
      }, 60);
      setTimeout(() => {
        o.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
        o.style.transform = "translateY(-101%)";
        setTimeout(() => {
          o.style.transition = "none";
          o.style.transform = "translateY(101%)";
          busy.current = false;
        }, 640);
      }, 820);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      {children}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 990,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          ref={ovRef}
          style={{
            position: "absolute",
            inset: 0,
            // Encre de la refonte : le voile est sombre, le mot en fond clair,
            // cohérent avec la palette --jk-*.
            background: "var(--jk-ink)",
            transform: "translateY(101%)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div
              style={{
                fontFamily: "var(--jk-sans)",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--jk-bg)",
                opacity: 0.45,
                marginBottom: 20,
              }}
            >
              {brandName}
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: "var(--jk-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(52px,9vw,132px)",
                lineHeight: 1,
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
              }}
            >
              <span ref={labelRef} style={{ color: "var(--jk-bg)", opacity: 0.2 }} />
              <span
                ref={fillRef}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  color: "var(--jk-bg)",
                  clipPath: "inset(0 100% 0 0)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
