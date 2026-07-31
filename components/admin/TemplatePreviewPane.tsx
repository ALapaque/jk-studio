"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pane d'aperçu d'un template : iframe same-origin sur la route `/preview/...`,
 *  avec basculeur desktop/mobile, rafraîchir et ouvrir dans un onglet.
 *
 *  Fidélité desktop/mobile : l'iframe est rendue à une **largeur logique** fixe
 *  (1280 desktop / 390 mobile) puis mise à l'échelle par `transform: scale()`
 *  pour tenir dans la largeur disponible — on voit donc la vraie mise en page à
 *  cette largeur, réduite, plutôt que la page « écrasée » à la largeur du panneau
 *  admin. Le basculeur ne change pas l'URL (`baseSrc`) : pas de rechargement. */

const VIEWPORTS = {
  desktop: { w: 1280, h: 820 },
  mobile: { w: 390, h: 780 },
} as const;

type Viewport = keyof typeof VIEWPORTS;

export function TemplatePreviewPane({ baseSrc }: { baseSrc: string }) {
  const [nonce, setNonce] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [paneW, setPaneW] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  // Largeur disponible, suivie en direct pour recalculer l'échelle.
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setPaneW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const src = `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}n=${nonce}`;
  const { w: lw, h: lh } = VIEWPORTS[viewport];
  // On réduit pour tenir, jamais on n'agrandit (mobile reste à taille réelle).
  const scale = paneW > 0 ? Math.min(1, paneW / lw) : 1;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md border border-input p-0.5">
          {(["desktop", "mobile"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setViewport(v)}
              aria-pressed={viewport === v}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs",
                viewport === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "desktop" ? (
                <Monitor className="size-3.5" />
              ) : (
                <Smartphone className="size-3.5" />
              )}
              {v === "desktop" ? "Bureau" : "Mobile"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setNonce((x) => x + 1)}
            className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-3.5" /> Rafraîchir
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3.5" /> Onglet
          </a>
        </div>
      </div>

      {/* Cadre sombre : la boîte réserve la taille mise à l'échelle, l'iframe est
          rendue à sa taille logique puis réduite. */}
      <div
        ref={measureRef}
        className="overflow-hidden rounded-lg border border-input bg-[#0e0c0a] p-3"
      >
        <div
          style={{
            width: Math.round(lw * scale),
            height: Math.round(lh * scale),
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <iframe
            key={src}
            src={src}
            title="Aperçu du template"
            loading="lazy"
            style={{
              width: lw,
              height: lh,
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              background: "#0e0c0a",
            }}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Aperçu — reflète le contenu <strong>enregistré</strong>. Enregistre pour
        prévisualiser tes dernières modifications.
      </p>
    </div>
  );
}
