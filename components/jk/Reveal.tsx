"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Révélation à l'entrée dans le viewport : fondu + translation de 10px,
 *  600ms, courbe `cubic-bezier(.16,1,.3,1)`. Les valeurs vivent dans
 *  `app/jk-tokens.css` (`.jk-reveal`), transcrites de la maquette.
 *
 *  L'attribut `data-visible` est posé DIRECTEMENT sur le nœud plutôt que via
 *  un `useState`. Trois raisons : la règle `react-hooks/set-state-in-effect`
 *  du projet interdit un setState synchrone dans un effet ; aucun re-render
 *  n'est nécessaire pour une transition purement CSS ; et le rendu serveur
 *  reste identique au premier rendu client, donc aucun décalage d'hydratation.
 *
 *  Sous `prefers-reduced-motion`, l'élément est révélé immédiatement et sans
 *  transition — la page reste parfaitement lisible (§7). */
export function Reveal({
  children,
  as: Tag = "span",
  className,
  style,
  /** Ne se déclenche qu'une fois (défaut). Une légende qui rejouerait son
   *  animation à chaque passage serait pénible dans un défilé. */
  once = true,
  /** Part du seuil de visibilité à partir duquel on révèle. */
  threshold = 0.25,
}: {
  children: ReactNode;
  as?: "span" | "div";
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.visible = "true";
            if (once) io.disconnect();
          } else if (!once) {
            delete el.dataset.visible;
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLSpanElement & HTMLDivElement>}
      className={["jk-reveal", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
