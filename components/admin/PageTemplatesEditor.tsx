"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageTemplates } from "@/lib/theme";
import type { TemplateOption } from "./TemplatePicker";
import { TemplatePreviewPane } from "./TemplatePreviewPane";

/** Choix global de mise en page pour chaque page singleton, dans Apparence.
 *
 *  Un sélecteur de page (Accueil, Portfolio, Catégorie, À-propos, Contact) ;
 *  pour la page choisie : la grille de templates + l'aperçu desktop/mobile. Les
 *  cinq valeurs sont soumises ensemble via cinq `<input type="hidden">`
 *  (`tpl_<page>`) au formulaire parent (action `savePageTemplates`). Les options
 *  de chaque registre sont passées par le serveur (pas d'import de composant
 *  serveur côté client). */

type PageKey = keyof PageTemplates;

const PAGES: { key: PageKey; label: string; slug: string }[] = [
  { key: "home", label: "Accueil", slug: "home" },
  { key: "works", label: "Portfolio", slug: "works" },
  { key: "category", label: "Catégorie", slug: "category" },
  { key: "about", label: "À-propos", slug: "about" },
  { key: "contact", label: "Contact", slug: "contact" },
];

export function PageTemplatesEditor({
  initial,
  optionsByPage,
}: {
  initial: PageTemplates;
  optionsByPage: Record<PageKey, TemplateOption[]>;
}) {
  // Valeurs seed avec repli sur la 1re option si la clé stockée est inconnue.
  const [values, setValues] = useState<PageTemplates>(() => {
    const seed = { ...initial };
    for (const { key } of PAGES) {
      const opts = optionsByPage[key];
      if (!opts.some((o) => o.key === seed[key])) {
        seed[key] = opts[0]?.key ?? "classic";
      }
    }
    return seed;
  });
  const [page, setPage] = useState<PageKey>("home");

  const options = optionsByPage[page];
  const value = values[page];
  const set = (key: PageKey, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="grid gap-4">
      {PAGES.map(({ key }) => (
        <input key={key} type="hidden" name={`tpl_${key}`} value={values[key]} />
      ))}

      {/* Sélecteur de page */}
      <div className="flex flex-wrap gap-1.5">
        {PAGES.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPage(p.key)}
            aria-pressed={page === p.key}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              page === p.key
                ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                : "border-input text-muted-foreground hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Templates de la page sélectionnée */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => set(page, o.key)}
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

      <TemplatePreviewPane
        baseSrc={`/preview/page/${page}?tpl=${encodeURIComponent(value)}`}
      />
    </div>
  );
}
