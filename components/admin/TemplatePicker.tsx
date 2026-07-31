"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplatePreviewPane } from "./TemplatePreviewPane";

export interface TemplateOption {
  key: string;
  label: string;
  description: string;
}

/** Sélecteur de template d'une page détail (série/article) + aperçu live.
 *
 *  La valeur choisie est soumise via un `<input type="hidden" name="template">`
 *  du formulaire de l'éditeur. L'aperçu (desktop/mobile) est délégué à
 *  `TemplatePreviewPane`, pointant sur `/preview/<kind>/<id>?tpl=<value>`. */
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
  const known = options.some((o) => o.key === initial);
  const [value, setValue] = useState(
    known ? initial : options[0]?.key ?? "classic",
  );

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

      <TemplatePreviewPane
        baseSrc={`/preview/${kind}/${id}?tpl=${encodeURIComponent(value)}`}
      />
    </div>
  );
}
