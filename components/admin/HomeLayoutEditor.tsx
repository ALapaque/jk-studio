"use client";

import { useState } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  HOME_SECTION_TYPES,
  HOME_SECTION_META,
  HOME_LAYOUT_PRESETS,
  normalizeHomeLayout,
  type HomeLayout,
  type HomeSection,
  type HomeSectionType,
} from "@/lib/home-layout";

/** Composeur de la page d'accueil. Liste ordonnée de toutes les sections :
 *  réordonnables (glisser-déposer + flèches), activables, avec l'option « hero
 *  plein écran » et les variantes de mise en page. Sérialisé en JSON dans un
 *  champ caché `homeLayout` soumis avec le formulaire (action saveHomeLayout).
 *
 *  Même patron que HeroSlidesEditor : source de vérité unique côté contenu
 *  (`site_content.homeLayout`). L'ordre stocke toujours les cinq sections (avec
 *  leur drapeau activé) pour préserver la place des sections masquées. */

type Row = HomeSection & { key: string };

/** Garantit la présence des cinq sections, dans l'ordre du layout puis les
 *  manquantes en fin (désactivées). */
function toRows(layout: HomeLayout): Row[] {
  const rows: Row[] = layout.sections.map((s, i) => ({ ...s, key: `s-${i}` }));
  const present = new Set(rows.map((r) => r.type));
  let n = rows.length;
  for (const type of HOME_SECTION_TYPES) {
    if (!present.has(type)) {
      rows.push({
        type,
        enabled: false,
        ...(type === "hero" ? { fullscreen: true } : {}),
        key: `s-${n++}`,
      });
    }
  }
  return rows;
}

export function HomeLayoutEditor({ initial }: { initial: HomeLayout }) {
  const [rows, setRows] = useState<Row[]>(() =>
    toRows(normalizeHomeLayout(initial)),
  );
  const [dragKey, setDragKey] = useState<string | null>(null);

  const serialized = JSON.stringify({
    sections: rows.map((r) => {
      const s: HomeSection = { type: r.type, enabled: r.enabled };
      if (r.variant) s.variant = r.variant;
      if (r.type === "hero") s.fullscreen = r.fullscreen !== false;
      return s;
    }),
  });

  const patch = (key: string, next: Partial<HomeSection>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...next } : r)));

  const move = (key: string, dir: -1 | 1) =>
    setRows((rs) => {
      const i = rs.findIndex((r) => r.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const reorderTo = (fromKey: string, toKey: string) =>
    setRows((rs) => {
      if (fromKey === toKey) return rs;
      const from = rs.findIndex((r) => r.key === fromKey);
      const to = rs.findIndex((r) => r.key === toKey);
      if (from < 0 || to < 0) return rs;
      const copy = [...rs];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });

  const applyPreset = (presetKey: string) => {
    const preset = HOME_LAYOUT_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;
    setRows(toRows(normalizeHomeLayout({ sections: preset.sections })));
  };

  return (
    <div className="grid gap-3">
      <input type="hidden" name="homeLayout" value={serialized} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Partir d&apos;un modèle :</span>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) applyPreset(e.target.value);
            e.target.value = "";
          }}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
        >
          <option value="" disabled>
            Choisir un modèle…
          </option>
          {HOME_LAYOUT_PRESETS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        {rows.map((r, i) => {
          const meta = HOME_SECTION_META[r.type as HomeSectionType];
          return (
            <div
              key={r.key}
              draggable
              onDragStart={() => setDragKey(r.key)}
              onDragEnd={() => setDragKey(null)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragKey && dragKey !== r.key) reorderTo(dragKey, r.key);
              }}
              className={`flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-2.5 ${
                dragKey === r.key ? "opacity-50" : ""
              } ${r.enabled ? "" : "opacity-70"}`}
            >
              <span
                className="cursor-grab text-muted-foreground active:cursor-grabbing"
                aria-hidden
                title="Glisser pour réordonner"
              >
                <GripVertical className="size-4" />
              </span>

              <div className="min-w-[150px] flex-1">
                <div className="text-sm font-medium">{meta.label}</div>
                <div className="text-xs text-muted-foreground">
                  {meta.description}
                </div>
              </div>

              {meta.hasFullscreen && (
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Plein écran
                  <Switch
                    checked={r.fullscreen !== false}
                    onCheckedChange={(v) => patch(r.key, { fullscreen: v })}
                  />
                </label>
              )}

              {meta.variants && (
                <select
                  value={r.variant ?? meta.variants[0].key}
                  onChange={(e) => patch(r.key, { variant: e.target.value })}
                  className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  aria-label={`Mise en page — ${meta.label}`}
                >
                  {meta.variants.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.label}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-1">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Affichée
                  <Switch
                    checked={r.enabled}
                    onCheckedChange={(v) => patch(r.key, { enabled: v })}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Monter"
                  disabled={i === 0}
                  onClick={() => move(r.key, -1)}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Descendre"
                  disabled={i === rows.length - 1}
                  onClick={() => move(r.key, 1)}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
