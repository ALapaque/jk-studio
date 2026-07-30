"use client";

import { useRef, useState } from "react";
import { Check, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sélecteur de template de page détail + aperçu live en iframe.
 *
 *  La valeur choisie est soumise via un `<input type="hidden" name="template">`
 *  au sein du `<form>` de l'éditeur (sauvée par updateProject / updatePost).
 *  L'iframe pointe vers `/preview/<kind>/<id>?tpl=<value>` : elle reflète le
 *  CONTENU DÉJÀ ENREGISTRÉ + le template sélectionné (même non sauvegardé).
 *  D'où le rappel « enregistre pour voir tes dernières modifs de contenu ». */

export interface TemplateOption {
  key: string;
  label: string;
  description: string;
}

export function TemplatePicker({
  kind,
  id,
  options,
  initial,
}: {
  kind: "series" | "post";
  id: string;
  options: TemplateOption[];
  initial: string;
}) {
  // Repli sur la 1re option si la valeur stockée n'existe plus dans le registre.
  const known = options.some((o) => o.key === initial);
  const [value, setValue] = useState(
    known ? initial : options[0]?.key ?? "classic",
  );
  // `nonce` force le rechargement de l'iframe au clic « rafraîchir ».
  const [nonce, setNonce] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewSrc = `/preview/${kind}/${id}?tpl=${encodeURIComponent(value)}&n=${nonce}`;

  return (
    <div className="grid gap-4">
      <input type="hidden" name="template" value={value} />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setValue(o.key)}
              aria-pressed={active}
              className={cn(
                "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-input hover:border-foreground/30 hover:bg-accent/40",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{o.label}</span>
                {active && <Check className="size-4 text-primary" />}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {o.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            Aperçu — reflète le contenu <strong>enregistré</strong>. Enregistre
            pour prévisualiser tes dernières modifications.
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setNonce((n) => n + 1)}
              className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="size-3.5" /> Rafraîchir
            </button>
            <a
              href={previewSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" /> Onglet
            </a>
          </div>
        </div>

        {/* Ratio ~16/10, cadre sombre : donne une idée fidèle du plein écran.
            L'iframe est same-origin → l'auth de l'admin passe (requireUser). */}
        <div className="overflow-hidden rounded-lg border border-input bg-[#0e0c0a]">
          <iframe
            ref={iframeRef}
            key={previewSrc}
            src={previewSrc}
            title="Aperçu du template"
            loading="lazy"
            className="block h-[62vh] w-full"
          />
        </div>
      </div>
    </div>
  );
}
